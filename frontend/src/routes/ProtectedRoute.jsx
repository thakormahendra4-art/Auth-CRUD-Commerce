import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ allowedRoles }) => {
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;