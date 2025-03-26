import { useDispatch, useSelector } from "react-redux";
import { Button } from "./components/ui/button"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CheckAuth from "./components/auth/checkAuth";
import AuthLayout from "./components/auth/AuthLayout";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import Home from "./components/shared/Home";
import Profile from "./components/auth/Profile";
import { Loader } from "lucide-react";
import { checkAuth } from "./store/authSlice";
import { useEffect } from "react";
import NotFound from "./pages/shared/NotFound";
import UserJobTable from "./components/job/UserJobTable";
import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";
import ApplyJob from "./components/job/ApplyJob";



function App() {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector(state => state.authSlice.isAuthenticated);
  const { user, isLoading } = useSelector(state => state.authSlice);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  // const location = useLocation();
  // const onHomeScreen = location.pathname.startsWith('/home')
  // const onClassScreen = location.pathname.startsWith("/enter");
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className='app'>

      <Routes>
        <Route path='/auth' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}

          ><AuthLayout /></CheckAuth>
        }>
          <Route path="Login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path='/profile' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><Profile /></CheckAuth>
        }></Route>
        {/* //to get the applied jobs by student */}
        <Route path='/applied-jobs' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><UserJobTable /></CheckAuth>
        }></Route>

        {/* jobs */}
        <Route path='/jobs' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><Jobs /></CheckAuth>
        }></Route>

        {/* details */}

        <Route path='/description/:jobId' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><JobDetails /></CheckAuth>
        }></Route>

        {/* apply job */}
        <Route path='/apply/:jobId' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><ApplyJob /></CheckAuth>
        }></Route>










        <Route path='/' element={<Navigate to={user?.role === 'recruiter' ? "/my-jobs" : '/jobs'} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <ToastContainer />

    </div>

  )
}

export default App
