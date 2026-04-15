import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function ProtectedRoute({ children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
