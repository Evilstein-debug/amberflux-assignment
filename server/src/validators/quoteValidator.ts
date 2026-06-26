import { z } from "zod";

// POST /quotes
export const createQuoteSchema = z
    .object({
        customer: z.string({ error: "Customer name is required" }).min(1, "Customer name is required"),
        project: z.string({ error: "Project name is required" }).min(1, "Project name is required"),
        city: z.string({ error: "City is required" }).min(1, "City is required"),
        priority: z.enum(["Low", "Medium", "High"]),
        estimated_value: z
            .number({ error: "Estimated value must be a number" })
            .positive("Estimated value must be greater than 0"),
    })
    .transform(({ estimated_value, ...rest }) => ({
        ...rest,
        estimatedValue: estimated_value,
    }));

// PATCH /quotes/:id/status
export const updateStatusSchema = z.object({
    status: z.enum([
        "New",
        "InReview",
        "NeedsInfo",
        "WaitingForCustomer",
        "Completed",
    ]),
});

export type CreateQuoteInput = z.input<typeof createQuoteSchema>;
export type CreateQuoteOutput = z.output<typeof createQuoteSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
