import { useDispatch, useSelector } from "react-redux";
import { Button } from "./components/ui/button"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CheckAuth from "./components/auth/checkAuth";
import AuthLayout from "./components/auth/AuthLayout";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import Home from "./components/shared/Home";
import Profile from "./pages/users/Profile";
import { Loader } from "lucide-react";
import { checkAuth } from "./store/authSlice";
import { useEffect } from "react";
import NotFound from "./pages/shared/NotFound";
import UserJobTable from "./pages/jobs/UserJobTable";
import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";
import ApplyJob from "./pages/jobs/ApplyJob";
import StudentSchedule from "./pages/schedules/StudentSchedule";
import AllUsers from "./pages/tpo/AllUsers";
import AllCompanies from "./pages/tpo/AllCompanies";
import Dashboard from "./pages/tpo/Dashboard";
import JobCreation from "./pages/jobs/JobCreation";
import JobsCreated from "./pages/jobs/JobsCreated";
import SchedulesForJob from "./pages/schedules/SchedulesForJob";
import AllApplicants from "./pages/users/AllApplicants";
import RecruiterCompanies from "./pages/companies/RecruiterCompanies";




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

        {/* fetch schedules for student */}

        <Route path='/schedule' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><StudentSchedule /></CheckAuth>
        }></Route>

        {/* tpo fetch users */}

        <Route path='/users' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><AllUsers /></CheckAuth>
        }></Route>

        {/* all companies */}

        <Route path='/all-companies' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><AllCompanies /></CheckAuth>
        }></Route>

        {/* accept/reject users tpo and recruiters */}
        <Route path='/dashboard' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><Dashboard /></CheckAuth>
        }></Route>

        {/* coordinator */}
        <Route path='/coordinator' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><Home /></CheckAuth>
        }></Route>

        {/* create job */}
        <Route path='/create-job' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><JobCreation /></CheckAuth>
        }></Route>

        {/* jobs created */}

        <Route path='/jobs-created' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><JobsCreated /></CheckAuth>
        }></Route>

        {/* fetch schedules */}
        <Route path='/fetch-schedules/:jobId' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><SchedulesForJob /></CheckAuth>
        }></Route>
        {/* fetch all applicants */}
        <Route path='/job-applicants/:jobId' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><AllApplicants /></CheckAuth>
        }></Route>

        {/* view schedules */}
        <Route path='/my-compnaies' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
          ><RecruiterCompanies /></CheckAuth>
        }></Route>










        <Route path='/' element={<Navigate to={user?.role === 'recruiter' ? "/my-compnaies" : '/jobs'} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <ToastContainer />

    </div>

  )
}

export default App
