import { Navigate } from "react-router-dom";

function UserRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "user") {
    return <Navigate to="/" />;
  }

  return children;
}

export default UserRoute;
