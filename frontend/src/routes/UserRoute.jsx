import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function UserRoute({ children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "user") {
    return <Navigate to="/" />;
  }

  return children;
}

export default UserRoute;
