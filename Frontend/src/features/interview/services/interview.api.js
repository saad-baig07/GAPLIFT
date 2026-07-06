import axios from "axios"

const interviewApi = axios.create({
  baseURL: "https://gaplift-1.onrender.com/api/interview",
  withCredentials: true
})

export async function generateInterviewReport(formData) {
  const response = await interviewApi.post("/", formData)
  return response.data
}

export async function getInterviewReports() {
  const response = await interviewApi.get("/")
  return response.data
}

export async function getInterviewReport(id) {
  const response = await interviewApi.get(`/${id}`)
  return response.data
}
