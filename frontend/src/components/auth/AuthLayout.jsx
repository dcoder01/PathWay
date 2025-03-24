import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen">

      <div className="hidden md:flex items-center justify-center bg-black w-1/3 p-8">
        <h1 className="text-5xl font-bold text-white">PathWay</h1>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
