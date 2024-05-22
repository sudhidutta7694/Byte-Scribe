import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const withAuth = (Component) => {
  const AuthRoute = (props) => {
    const { user } = useContext(UserContext);

    if (!user) {
      return <Redirect to="/login" />;
    }

    // You can add additional checks here for admin access, etc.

    return <Component {...props} />;
  };

  return AuthRoute;
};

export default withAuth;
