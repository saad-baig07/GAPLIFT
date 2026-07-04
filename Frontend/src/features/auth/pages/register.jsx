import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
import LoadingScreen from '../../../components/LoadingScreen'

const Register = () => {
    const {loading,handleRegister}=useAuth()
    const navigate = useNavigate()
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({username,email,password})
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.")
        }
    }

    if(loading)
        return <LoadingScreen />

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="text" id="username" name="username" placeholder='Enter your user name' />
                </div>
                
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder='Enter your email address' />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder='Enter your password' />
                </div>

                <button className='button primary-button' type="submit" disabled={loading}>Register</button>
            </form>
            {error && <p className="auth-error">{error}</p>}
            <p className="redirect-text">
            Already have an account?
            <Link to="/login" className="auth-link">
            Login
            </Link>
            </p>
        </div>
    </main>

  )
}

export default Register
