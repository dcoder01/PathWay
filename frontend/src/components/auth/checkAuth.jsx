import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children }) {
    const location = useLocation();

    if (isAuthenticated) {
        if (location.pathname.includes("/login") || location.pathname.includes("/register")) {
            return <Navigate to="/" />;
        }
    }
    else {
        if (
            !(
                location.pathname.includes("/login") ||
                location.pathname.includes("/register")
            )
        ) {
            return <Navigate to="/auth/login" />;
        }
    }

    return <>{children}</>;
}

export default CheckAuth;
