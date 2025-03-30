import React, { useEffect } from 'react';
import Header from './Header';
import { Briefcase, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CoordinatorHeader from './CoordinatorHeader';


const Home = () => {
    const {user} =useSelector((state)=>state.authSlice)
    const navigate=useNavigate()

    useEffect(()=>{
        if(user && user.role!=='coordinator'){
            toast.error("You are not allowed to view this page")
            navigate('/')
        }
    },[])

  return (
    <div className="bg-gray-50">
      <CoordinatorHeader />
      
      <div className="mt-14 max-w-4xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-500 px-6 py-10 flex flex-col items-center text-center">
            <Briefcase className="text-white w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold text-white">Welcome back, Coordinator!</h1>
            <p className="mt-2 text-blue-100">
              manage jobs, schedules, interviews all at one place.
            </p>
          </div>

      
        </div>
      </div>
    </div>
  );
};

export default Home;
