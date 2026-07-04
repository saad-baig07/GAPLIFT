import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useParams } from "react-router"
import { getInterviewReport } from "../services/interview.api"
import "../style/interview.scss"

const tabs = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "roadmap", label: "Road Map" }
]

export default function Interview() {
  const { id } = useParams()
  const location = useLocation()
  const [active, setActive] = useState("technical")
  const [report, setReport] = useState(location.state?.report || null)
  const [loading, setLoading] = useState(!location.state?.report)
  const [error, setError] = useState("")

  useEffect(() => {
    if (report || !id) {
      return
    }

    let isMounted = true

    const loadReport = async () => {
      try {
        const data = await getInterviewReport(id)
        if (isMounted) {
          setReport(data.interviewReport)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load interview report.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadReport()

    return () => {
      isMounted = false
    }
  }, [id, report])

  const activeItems = useMemo(() => {
    if (!report) {
      return []
    }

    if (active === "technical") {
      return report.technicalQuestion || []
    }

    if (active === "behavioral") {
      return report.behavioralQuestion || []
    }

    return report.preparationPlan || []
  }, [active, report])

  const renderMainContent = () => {
    if (loading) {
      return <p className="interview-state">Loading report...</p>
    }

    if (error) {
      return <p className="interview-state error">{error}</p>
    }

    if (!report) {
      return (
        <div className="interview-empty">
          <h1>No report selected</h1>
          <Link to="/" className="create-report-link">Generate Report</Link>
        </div>
      )
    }

    if (active === "roadmap") {
      return (
        <>
          <div className="content-heading">
            <span>Road Map</span>
            <h1>7 day preparation plan</h1>
          </div>
          <div className="question-list">
            {activeItems.map((day) => (
              <article className="report-block" key={day.day}>
                <div className="block-title">
                  <span>Day {day.day}</span>
                  <h2>{day.focus}</h2>
                </div>
                <ul>
                  {day.tasks?.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        <div className="content-heading">
          <span>{active === "technical" ? "Technical Round" : "Behavioral Round"}</span>
          <h1>{active === "technical" ? "Technical questions" : "Behavioral questions"}</h1>
        </div>
        <div className="question-list">
          {activeItems.map((item, index) => (
            <article className="report-block" key={`${active}-${index}`}>
              <div className="block-title">
                <span>Question {index + 1}</span>
                <h2>{item.question}</h2>
              </div>
              <section>
                <h3>Intention</h3>
                <p>{item.intention}</p>
              </section>
              <section>
                <h3>Suggested Answer</h3>
                <p>{item.answer}</p>
              </section>
            </article>
          ))}
        </div>
      </>
    )
  }

  return (
    <main className="interview-page">
      <aside className="interview-left">
        <div className="score-box">
          <span>Match Score</span>
          <strong>{report?.matchScore ?? "--"}%</strong>
        </div>
        <nav className="interview-tabs" aria-label="Interview report sections">
          {tabs.map((tab) => (
            <button
              className={active === tab.id ? "active" : ""}
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="interview-main">
        {renderMainContent()}
      </section>

      <aside className="interview-right">
        <h2>Skill Gaps</h2>
        <div className="skill-list">
          {(report?.skillGaps || []).map((skill, index) => (
            <div className="skill-chip" key={`${skill.skill}-${index}`}>
              <span>{skill.skill}</span>
              <strong className={`severity ${skill.severity}`}>{skill.severity}</strong>
            </div>
          ))}
          {!loading && report && (report.skillGaps || []).length === 0 && (
            <p>No skill gaps returned.</p>
          )}
        </div>
      </aside>
    </main>
  )
}
