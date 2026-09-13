"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals((metric: any) => {
    // Send metric to our telemetry endpoint
    const body = JSON.stringify({
      type: "web-vital",
      metric: {
        id: metric.id,
        name: metric.name,
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        rating: metric.rating,
      },
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/telemetry", body);
    } else {
      fetch("/api/telemetry", {
        body,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  });

  return null;
}
