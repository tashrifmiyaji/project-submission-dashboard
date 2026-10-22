
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Submission = {
  id: string;
  projectName: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubmissionResponse = {
  success: boolean;
  message: string;
  data: Submission;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetMySubmissionsResponse = {
  success: boolean;
  message: string;
  data: Submission[];
  meta: PaginationMeta;
};

export type SubmissionStudent = {
  id: string;
  name: string;
  email: string;
};

export type SubmissionReviewer = {
  id: string;
  name: string;
  email: string;
};

export type AllSubmission = Submission & {
  student: SubmissionStudent;
  reviewedBy: SubmissionReviewer | null;
};

export type GetAllSubmissionsResponse = {
  success: boolean;
  message: string;
  data: AllSubmission[];
  meta: PaginationMeta;
};
