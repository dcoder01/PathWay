import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { LogOut, User2, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { Eye } from 'lucide-react';
const Header = () => {
    const { user } = useSelector((state) => state.authSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
        navigate("/auth/login");
    };

    return (
        <header className="bg-white shadow-md fixed w-full z-50 top-0">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex justify-between items-center h-16">
                    {/* logo */}
                    <Link to="/" className="text-2xl font-bold">
                        PathWay
                    </Link>

                    <button className="md:hidden p-2" onClick={() => setIsNavOpen(!isNavOpen)}>
                        <Menu />
                    </button>

                    <nav className="hidden md:flex items-center gap-8">
                        <ul className="flex font-medium items-center gap-6">
                            
                            {user && user.role === "student" && (
                                <>
                                    <li><Link to="/jobs" >All Jobs</Link></li>
                                    <li><Link to="/applied-jobs">My Applications</Link></li>
                                    <li><Link to="/schedule">My Schedules</Link></li>
                                    <li><Link to='/chat'>Chat</Link></li>
                                </>
                            )}

                            {user && user.role === "coordinator" && (
                                <>
                                    <li><Link to="/coordinator">Coordinator</Link></li>
                                    <li><Link to="/jobs">All Jobs</Link></li>
                                    <li><Link to="/applied-jobs">My Applications</Link></li>
                                    <li><Link to="/schedule">My Schedules</Link></li>
                                 
                                </>
                            )}

                            {user && user.role === "tpo" && (
                                <>
                                    <li><Link to="/jobs">All Jobs</Link></li>
                                    <li><Link to="/all-companies">All Companies</Link></li>
                                    <li><Link to="/users">Users</Link></li>
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                </>
                            )}

                            {user && user.role === "recruiter" && (
                                <>
                                    <li><Link to="/my-companies">My Companies</Link></li>
                                    <li><Link to="/post-company">Register Comapny</Link></li>
                                </>
                            )}
                        </ul>


                        <Popover>
                            <PopoverTrigger asChild>
                                <User2 className="w-8 h-8 text-gray-500 cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        {/* <Avatar className="cursor-pointer">
                                                <AvatarImage src={User2} alt="User" />
                                            </Avatar> */}
                                        <User2 className="w-8 h-8 text-gray-500 " />
                                        <div>
                                            <h4 className="font-medium">{user?.name}</h4>
                
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-3 text-gray-600">
                                        {user && (user.role === "student" || user.role==='coordinator')  && (
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <Eye />
                                                <Button variant="link"><Link to="/profile" className="cursor-pointer" >View Profile</Link></Button>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 cursor-pointer mt-2">
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link" className="cursor-pointer">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                    </nav>
                </div>
            </div>


            {isNavOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
                    <ul className="flex flex-col items-center gap-4 py-4">
                        <li><Link to="/" className="hover:text-[#6A38C2]" onClick={() => setIsNavOpen(false)}>Home</Link></li>

                        {user && user.role === "student" && (
                            <>
                                <li><Link to="/jobs" onClick={() => setIsNavOpen(false)}>All Jobs</Link></li>
                                <li><Link to="/applied-jobs" onClick={() => setIsNavOpen(false)}>My Applications</Link></li>
                                <li><Link to="/schedule" onClick={() => setIsNavOpen(false)}>My Schedules</Link></li>
                                <li><Link to="/chat" onClick={() => setIsNavOpen(false)}>Chat</Link></li>
                            </>
                        )}

                        {user && user.role === "coordinator" && (
                            <>
                                <li><Link to="/coordinator" onClick={() => setIsNavOpen(false)}>Coordinator</Link></li>
                                <li><Link to="/jobs" onClick={() => setIsNavOpen(false)}>All Jobs</Link></li>
                                <li><Link to="/applied-jobs" onClick={() => setIsNavOpen(false)}>My Applications</Link></li>
                                <li><Link to="/schedule" onClick={() => setIsNavOpen(false)}>My Schedules</Link></li>
                                
                            </>
                        )}

                        {user && user.role === "tpo" && (
                            <>
                                <li><Link to="/jobs" onClick={() => setIsNavOpen(false)}>Jobs</Link></li>
                                <li><Link to="/all-companies" onClick={() => setIsNavOpen(false)}>All Companies</Link></li>
                                <li><Link to="/dashboard" onClick={() => setIsNavOpen(false)}>Dashboard</Link></li>
                                <li><Link to="/users" onClick={() => setIsNavOpen(false)}>Users</Link></li>
                            </>
                        )}

                        {user && user.role === "recruiter" && (
                            <>
                              
                                <li><Link to="/my-compnaies" onClick={() => setIsNavOpen(false)}>My Companies</Link></li>
                                <li><Link to="/post-company" onClick={() => setIsNavOpen(false)}>Register Company</Link></li>
                            </>
                        )}


                        <li>
                            <Button onClick={logoutHandler} variant="link" className="text-red-500">Logout</Button>
                        </li>

                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;
