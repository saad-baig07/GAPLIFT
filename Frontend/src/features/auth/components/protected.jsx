import { useAuth } from "../hooks/useAuth"
import { Navigate, NavLink, useNavigate } from "react-router"
import LoadingScreen from '../../../components/LoadingScreen'
import "./protected.scss"

const Protected=({children})=> {
    const { loading,user,handleLogout}=useAuth()
    const navigate = useNavigate()

    const logout = async () => {
        await handleLogout()
        navigate("/login")
    }

    if(loading)
        return <LoadingScreen />
    if(!user)
        return <Navigate to="/login" replace />

    return (
        <div className="app-shell">
            <nav className="app-navbar">
                <div className="navbar-left">
                    <NavLink to="/" className="brand">GapLift</NavLink>
                    <span className="user-greeting">Hii, {user.username}</span>
                </div>
                <div className="navbar-actions">
                    <NavLink to="/reports" className="nav-button">Previous Reports</NavLink>
                    <button className="nav-button logout-button" type="button" onClick={logout}>Logout</button>
                </div>
            </nav>
            {children}
        </div>
    )
}

export default Protected
