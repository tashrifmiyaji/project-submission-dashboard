
import { z } from "zod";

export const createMentorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(254, "Email cannot exceed 254 characters")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

export const updateMentorStatusSchema = z.object({
  isActive: z.boolean({
    error: "isActive must be a boolean",
  }),
});

export const getMentorsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),

  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateMentorInput = z.infer<typeof createMentorSchema>;

export type UpdateMentorStatusInput = z.infer<
  typeof updateMentorStatusSchema
>;

export type GetMentorsQuery = z.infer<typeof getMentorsQuerySchema>;
