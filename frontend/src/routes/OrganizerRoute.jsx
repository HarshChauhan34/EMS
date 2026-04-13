import { Navigate } from "react-router-dom";

function OrganizerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

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