import { createBrowserRouter } from "react-router"
import Home from "../src/features/interview/pages/Home"
import Interview from "./features/interview/pages/interview"
import Reports from "./features/interview/pages/Reports"
import Login from "./features/auth/pages/login"
import Register from "./features/auth/pages/register"
import Protected from "./features/auth/components/protected"

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/interview/:id",
        element:<Protected><Interview/></Protected>
    },
    {
        path:"/reports",
        element:<Protected><Reports/></Protected>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
])
