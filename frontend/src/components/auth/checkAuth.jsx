import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import WaitingForApproval from "./WaitingForApproval";

function CheckAuth({ isAuthenticated, children }) {
    const location = useLocation();
    const {user}=useSelector((state)=>state.authSlice)
    if (isAuthenticated) {

        if (user && user.role !== 'student' && user.isApproved === false) {
            return <WaitingForApproval />;
        }
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
