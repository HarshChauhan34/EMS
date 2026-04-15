import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function AdminRoute({ children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
