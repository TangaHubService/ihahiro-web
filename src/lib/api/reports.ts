import { apiClient, API_ENDPOINTS } from './client'

export type ReportReason = 'SCAM' | 'DUPLICATE' | 'INAPPROPRIATE' | 'WRONG_INFO' | 'OTHER'

export interface CreateReportInput {
  listingId: string
  reason: ReportReason
  message?: string
}

export const reportsApi = {
  create: async (data: CreateReportInput): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.REPORTS.CREATE, data)
  },
}
