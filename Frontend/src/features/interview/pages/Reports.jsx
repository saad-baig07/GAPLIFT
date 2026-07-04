import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getInterviewReports } from "../services/interview.api"
import "../style/reports.scss"

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadReports = async () => {
      try {
        const data = await getInterviewReports()
        if (isMounted) {
          setReports(data.interviewReports || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load reports.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="reports-page">
      <section className="reports-header">
        <p>Saved Work</p>
        <h1>Previous Reports</h1>
      </section>

      {loading && <p className="reports-message">Loading reports...</p>}
      {error && <p className="reports-message error">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <div className="empty-reports">
          <h2>No reports yet</h2>
          <p>Generate an interview report and it will show up here.</p>
          <Link to="/" className="report-link">Create Report</Link>
        </div>
      )}

      <section className="reports-grid">
        {reports.map((report) => (
          <Link to={`/interview/${report._id}`} className="report-card" key={report._id}>
            <div>
              <span className="score-pill">{report.matchScore ?? "--"}%</span>
              <h2>{report.jobDescription?.slice(0, 86) || "Interview Report"}</h2>
            </div>
            <p>{new Date(report.createdAt).toLocaleString()}</p>
            <span>Open Report</span>
          </Link>
        ))}
      </section>
    </main>
  )
}
