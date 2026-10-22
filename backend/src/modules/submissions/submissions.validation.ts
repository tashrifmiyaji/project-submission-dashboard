import { z } from "zod";

const normalizeGithubRepositoryUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    const pathSegments = url.pathname.replace(/^\/|\/$/g, "").split("/");

    if (
      url.protocol !== "https:" ||
      url.hostname !== "github.com" ||
      url.port !== "" ||
      url.username ||
      url.password ||
      pathSegments.length !== 2
    ) {
      return null;
    }

    const [owner, rawRepository] = pathSegments;
    const repository = rawRepository.replace(/\.git$/i, "");
    const validOwner = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(owner);
    const validRepository =
      /^[a-z0-9](?:[a-z0-9._-]{0,98}[a-z0-9])?$/i.test(repository);

    if (!validOwner || !validRepository) {
      return null;
    }

    return `https://github.com/${owner.toLowerCase()}/${repository.toLowerCase()}`;
  } catch {
    return null;
  }
};

export const createSubmissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(150, "Project name cannot exceed 150 characters"),

  repositoryUrl: z
    .string()
    .trim()
    .max(2048, "Repository URL is too long")
    .transform((value, context) => {
      const normalizedUrl = normalizeGithubRepositoryUrl(value);

      if (!normalizedUrl) {
        context.addIssue({
          code: "custom",
          message: "Please provide a valid HTTPS GitHub repository URL",
        });
        return z.NEVER;
      }

      return normalizedUrl;
    }),

  liveUrl: z
    .string()
    .trim()
    .url("Please provide a valid live project URL")
    .max(2048, "Live URL is too long")
    .refine((value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, "Live URL must use HTTPS"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
});

export const getSubmissionsQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),

  search: z.string().trim().max(150).optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateSubmissionInput = z.infer<
  typeof createSubmissionSchema
>;

export type GetSubmissionsQuery = z.infer<
  typeof getSubmissionsQuerySchema
>;
