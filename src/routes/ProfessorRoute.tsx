import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"

type RouteProps = {
  children: JSX.Element;
}

const ProfessorRoute = (props: RouteProps) => {
  const location = useLocation();
  const { user, userToken } = useContext(AuthContext);

  if (!userToken) {
    return <Navigate to="/auth" state={{ from: location }} />;
  }

  if (!user?.isProfessor) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return props.children;
}

export { ProfessorRoute };