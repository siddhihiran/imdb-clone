export interface TelemetryRecord {
  id: string;
  timestamp: number;
  endpoint: string;
  method: string;
  status: number;
  durationMs: number;
  cacheHit: boolean;
  retries: number;
  error?: string;
}

export interface WebVitalRecord {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
}

export interface TelemetryStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cacheHits: number;
  cacheHitRatio: number;
  avgDurationMs: number;
  recentRecords: TelemetryRecord[];
  webVitals?: Record<string, { avgValue: number; count: number; rating: string }>;
}

class TelemetryService {
  private records: TelemetryRecord[] = [];
  private webVitals: WebVitalRecord[] = [];
  private readonly maxRecords = 100;

  recordWebVital(metric: Omit<WebVitalRecord, "timestamp">) {
    this.webVitals.unshift({
      ...metric,
      timestamp: Date.now(),
    });
    if (this.webVitals.length > this.maxRecords) {
      this.webVitals.pop();
    }
  }

  record(entry: Omit<TelemetryRecord, "id" | "timestamp">): TelemetryRecord {
    const record: TelemetryRecord = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.records.unshift(record);
    if (this.records.length > this.maxRecords) {
      this.records.pop();
    }

    if (process.env.NODE_ENV === "development") {
      const statusColor = record.status >= 400 ? "\x1b[31m" : "\x1b[32m";
      const reset = "\x1b[0m";
      console.log(
        `[Telemetry] ${record.method} ${record.endpoint} ${statusColor}${record.status}${reset} (${record.durationMs}ms, hit: ${record.cacheHit}, retries: ${record.retries})`
      );
    }

    return record;
  }

  getStats(): TelemetryStats {
    const total = this.records.length;
    if (total === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        cacheHits: 0,
        cacheHitRatio: 0,
        avgDurationMs: 0,
        recentRecords: [],
      };
    }

    const success = this.records.filter((r) => r.status < 400).length;
    const failed = total - success;
    const cacheHits = this.records.filter((r) => r.cacheHit).length;
    const totalDuration = this.records.reduce((acc, r) => acc + r.durationMs, 0);

    // Compute Web Vitals aggregation
    const vitalsAgg: Record<string, { avgValue: number; count: number; rating: string }> = {};
    for (const v of this.webVitals) {
      if (!vitalsAgg[v.name]) {
        vitalsAgg[v.name] = { avgValue: 0, count: 0, rating: v.rating };
      }
      vitalsAgg[v.name].avgValue += v.value;
      vitalsAgg[v.name].count += 1;
    }
    for (const key of Object.keys(vitalsAgg)) {
      vitalsAgg[key].avgValue = Number((vitalsAgg[key].avgValue / vitalsAgg[key].count).toFixed(2));
    }

    return {
      totalRequests: total,
      successfulRequests: success,
      failedRequests: failed,
      cacheHits,
      cacheHitRatio: Number((cacheHits / total).toFixed(2)),
      avgDurationMs: Math.round(totalDuration / total),
      recentRecords: this.records.slice(0, 20),
      webVitals: vitalsAgg,
    };
  }

  clear() {
    this.records = [];
    this.webVitals = [];
  }
}

export const telemetry = new TelemetryService();
