import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import RouteDetail from "./pages/RouteDetail";
import Tracker from "./pages/Tracker";
import Connect from "./pages/Connect";
import BatchDetail from "./pages/BatchDetail";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0A0A0A"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem"}}>🏍️</div>
        <p style={{color:"#FF6B00",fontFamily:"Rajdhani",fontSize:"1.2rem",marginTop:"1rem"}}>Loading MotoMeet...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/explore" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/explore" /> : <Register />} />
        <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
        <Route path="/route/:slug" element={<PrivateRoute><RouteDetail /></PrivateRoute>} />
        <Route path="/tracker" element={<PrivateRoute><Tracker /></PrivateRoute>} />
        <Route path="/connect" element={<PrivateRoute><Connect /></PrivateRoute>} />
        <Route path="/batch/:id" element={<PrivateRoute><BatchDetail /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}