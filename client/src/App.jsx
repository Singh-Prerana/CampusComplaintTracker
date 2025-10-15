
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/LandingPage/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// import Users from "./pages/UsersPage";
// import UsersPage from "./pages/UsersPage";
import Notification from "./pages/Notification";
import VerifyOtp from "./pages/VerifyOtp";
import Overview from "./pages/Overview";
import Explore from "./pages/Explore";
export default function App() {
  return (
    <AuthProvider>
  
      <main className="container ">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoute allowed={['student']} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student-dashboard/submit" element={<SubmitComplaint />} />
            <Route path="/student-dashboard/profile" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/student-dashboard/notification" element={<Notification />} />
          </Route>
          <Route element={<PrivateRoute allowed={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/profile" element={<Profile />} />
            <Route path="/admin-dashboard/overview" element={<Overview />} />
            {/* <Route path="/admin-dashboard/complaints" element={<ComplaintsPage />} />
            <Route path="/admin-dashboard/notification" element={<Notification />} /> */}
            {/* <Route path="/admin-dashboard/users" element={<UsersPage />} /> */}
          </Route>
        </Routes>
      </main>
    </AuthProvider>
  )
}