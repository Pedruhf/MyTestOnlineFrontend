import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"

type RouteProps = {
  children: JSX.Element;
}

const AuthRoute = (props: RouteProps) => {
  const location = useLocation();
  const { userToken } = useContext(AuthContext);

  if (!userToken) {
    return <Navigate to="/auth" state={{ from: location }} />;
  }

  return props.children;
}

export { AuthRoute };