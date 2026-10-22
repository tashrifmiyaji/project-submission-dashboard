import { z } from "zod";

export const createSubmissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(150, "Project name cannot exceed 150 characters"),

  repositoryUrl: z
    .string()
    .trim()
    .url("Please provide a valid repository URL")
    .max(2048, "Repository URL is too long")
    .refine(
      (value) => {
        try {
          const url = new URL(value);

          return (
            url.protocol === "https:" &&
            url.hostname.toLowerCase() === "github.com"
          );
        } catch {
          return false;
        }
      },
      "Repository URL must be a valid HTTPS GitHub URL",
    ),

  liveUrl: z
    .string()
    .trim()
    .url("Please provide a valid live project URL")
    .max(2048, "Live URL is too long")
    .refine(
      (value) => {
        try {
          return new URL(value).protocol === "https:";
        } catch {
          return false;
        }
      },
      "Live URL must use HTTPS",
    ),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
});

export type CreateSubmissionFormValues = z.infer<
  typeof createSubmissionSchema
>;