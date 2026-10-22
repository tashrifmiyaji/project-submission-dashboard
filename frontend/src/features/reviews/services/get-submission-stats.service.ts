import { api } from "@/apis/api";

export type SubmissionStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type GetSubmissionStatsResponse = {
  success: boolean;
  message: string;
  data: SubmissionStats;
};

export const getSubmissionStats = async (): Promise<GetSubmissionStatsResponse> =>
  api<GetSubmissionStatsResponse>("/submissions/stats");
