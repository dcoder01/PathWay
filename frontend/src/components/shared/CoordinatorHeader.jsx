import React, { useState } from "react";

import { LogOut, User2, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const CoordinatorHeader = () => {

    const [isNavOpen, setIsNavOpen] = useState(false);
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
                            <li><Link to="/coordinator" >Home</Link></li>
                            <li><Link to="/jobs-created">Jobs created</Link></li>
                            <li><Link to="/create-job" >Create Job</Link></li>
                            <li><Link to='/chat'>Chat</Link></li>

                        </ul>

                    </nav>
                </div>
            </div>


            {isNavOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
                    <ul className="flex flex-col items-center gap-4 py-4">
                        <li><Link to="/coordinator" onClick={() => setIsNavOpen(false)}>Home</Link></li>
                        <li><Link to="/jobs-created" onClick={() => setIsNavOpen(false)}>Jobs created</Link></li>
                        <li><Link to="/create-job" onClick={() => setIsNavOpen(false)}>Create Job</Link></li>
                        <li><Link to="/chat" onClick={() => setIsNavOpen(false)}>Chat</Link></li>


                    </ul>
                </div>
            )}
        </header>
    );
};

export default CoordinatorHeader;
