import { useState } from 'react'
import { useNavigate } from 'react-router'
import { generateInterviewReport } from '../services/interview.api'
import "../style/home.scss"

function Home() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!jobDescription.trim() || !selfDescription.trim() || !resume) {
      setError("Please add job description, self description, and resume PDF.")
      return
    }

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resume)

    try {
      setLoading(true)
      const data = await generateInterviewReport(formData)
      navigate(`/interview/${data.interviewReport._id}`, {
        state: { report: data.interviewReport }
      })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview report.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='home'>
      <section className="home-header">
        <p>Interview Readiness</p>
        <h1>Generate your report</h1>
      </section>
      <form className="interview-form" onSubmit={handleSubmit}>
        <div className="left">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            className='jobDescription'
            id='jobDescription'
            placeholder='Paste the job description here'
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="right">
          <div className="input-group">
            <label htmlFor="resume">Upload Resume</label>
            <input
              type='file'
              name='resume'
              id='resume'
              accept='.pdf'
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
          <div className="input-group self-group">
            <label htmlFor='selfDescription'>Self Description</label>
            <textarea
              className='selfDescription'
              id='selfDescription'
              placeholder='Write your self Description'
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            ></textarea>
          </div>
          {error && <p className="form-message error">{error}</p>}
          <button className="generate-btn" type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Interview Report"}
          </button>
        </div>
      </form>
    </main>
  )
}

export default Home
