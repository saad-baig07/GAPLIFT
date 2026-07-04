import { useState } from 'react'
import "../auth.form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../../../components/LoadingScreen'

const Login = () => {
const {loading,handleLogin}=useAuth()
const navigate = useNavigate()

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [error,setError]=useState("")

const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")
    try {
        await handleLogin({email,password})
        navigate("/")
    } catch (err) {
        setError(err.response?.data?.message || "Login failed. Please try again.")
    }
}
if(loading)
    return <LoadingScreen />

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder='Enter your email address' />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder='Enter your password' />
                </div>

                <button className='button primary-button' type="submit" disabled={loading}>Login</button>
            </form>
            {error && <p className="auth-error">{error}</p>}
             <p className="redirect-text">
            Don't have an account?
            <Link to="/register" className="auth-link">
            Register
            </Link>
            </p>
        </div>
    </main>
  )
}

export default Login
