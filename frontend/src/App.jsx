import { useDispatch, useSelector } from "react-redux";
import { Button } from "./components/ui/button"
import { Route, Routes, useLocation } from "react-router-dom";
import CheckAuth from "./components/auth/checkAuth";
import AuthLayout from "./components/auth/AuthLayout";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
// import Login from "./pages/Login";



function App() {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector(state => state.authSlice.isAuthenticated);
  const { user, isLoading } = useSelector(state => state.authSlice);
  // useEffect(() => {
  //   dispatch(checkAuth());
  // }, [dispatch]);
  // const location = useLocation();
  // const onHomeScreen = location.pathname.startsWith('/home')
  // const onClassScreen = location.pathname.startsWith("/enter");
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader className="w-8 h-8 animate-spin" />
  //     </div>
  //   );
  // }
  return (
    <div className='app'>
      {/* <>{onHomeScreen ? <HeaderHome /> : onClassScreen && <HeaderClass />}  </> */}
      <Routes>
        <Route path='/auth' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}

          ><AuthLayout /></CheckAuth>
        }>
          <Route path="Login" element={<Login/>} />
          <Route path="register" element={<Register />} />
        </Route>
        {/* <Route path='/home' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ><Home /></CheckAuth>
        }></Route> */}










        {/* <Route path='/' element={<Navigate to={'/home'} />} /> */}
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>

      <ToastContainer />

    </div>

  )
}

export default App
