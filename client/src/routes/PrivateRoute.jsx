import { Navigate, Outlet } from "react-router-dom";
export default function PrivateRoute({ allowed = [] }) {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token) return <Navigate to="login" replace />;
    if (allowed.length && !allowed.includes(role)) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}