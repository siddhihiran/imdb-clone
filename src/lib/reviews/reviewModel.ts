import { z } from "zod";

/**
 * Wilson score lower bound of Wilson score interval for a Bernoulli parameter
 * High confidence sorting of reviews by upvotes vs downvotes.
 */
export function calculateWilsonScore(positive: number, negative: number, confidence = 1.96): number {
  const n = positive + negative;
  if (n === 0) return 0;

  const phat = positive / n;
  const z2 = confidence * confidence;

  const numerator =
    phat + z2 / (2 * n) - confidence * Math.sqrt((phat * (1 - phat) + z2 / (4 * n)) / n);
  const denominator = 1 + z2 / n;

  return Math.max(0, numerator / denominator);
}

/**
 * Zod validation schema for reviews
 */
export const reviewSchema = z.object({
  movieId: z.union([z.string(), z.number()]),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters long")
    .max(2500, "Review must not exceed 2500 characters"),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Minimum rating is 1")
    .max(10, "Maximum rating is 10"),
  containsSpoilers: z.boolean().default(false),
  author: z.string().min(2, "Author name required").default("Current User"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export interface ReviewRecord extends ReviewInput {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt?: number;
  upvotes: number;
  downvotes: number;
  wilsonScore: number;
  isDeleted?: boolean;
  moderationFlags?: {
    flaggedBy: string;
    reason: string;
    timestamp: number;
  }[];
  pending?: boolean; // For optimistic UI updates
}
