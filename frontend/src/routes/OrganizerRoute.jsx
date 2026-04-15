import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function OrganizerRoute({ children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "organizer") {
    return <Navigate to="/" replace />;
  }

  if (user.isApprovedOrganizer === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default OrganizerRoute;
