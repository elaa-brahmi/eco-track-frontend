import { ReportData } from "../types/reportType"

export const createReport = async (data: ReportData): Promise<any> => {
  if (!data.file) {
    throw new Error("Photo is required")
  }

  const formData = new FormData()
  formData.append("file", data.file)
  formData.append("description", data.description)
  formData.append("location", data.location) 

  const res = await fetch("/api/proxy/api/reports", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Failed to create report")
  }

  return res.json()
}
