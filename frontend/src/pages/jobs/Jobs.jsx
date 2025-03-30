import React, { useEffect, useState } from 'react';
import Navbar from '../../components/shared/Header';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Job from '@/components/job/Job';
import FilterCard from '@/components/job/FilterCard';
import { fetchAllJobs } from '@/store/jobSlice';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Jobs = () => {
    const dispatch = useDispatch();
    const { allJobs, searchQuery, isLoading } = useSelector(store => store.jobSlice);
    const [filterJobs, setFilterJobs] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const {user}=useSelector((state)=>state.authSlice)
    const navigate=useNavigate()
    useEffect(()=>{
        if(user && user.role==='recruiter'){
            toast.error("Not allowed")
            navigate('/')
        }
    },[user, navigate])

    useEffect(() => {
        dispatch(fetchAllJobs());
    }, [dispatch]);

    useEffect(() => {
        if (searchQuery) {
            const filteredJobs = allJobs.filter((job) =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase())) ||
                job.jobType.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchQuery]);

    return (
        <div className="relative">
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 p-4'>
                <div className="sticky top-16 z-40 flex justify-end mb-4">
                    <Button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className="flex items-center gap-2 bg-white shadow-md"
                        variant="outline"
                    >
                        <Filter size={18} /> Filters
                    </Button>
                </div>

                <div className='flex flex-col md:flex-row gap-5 relative'>
                    <AnimatePresence>
                        {showFilters && (
                            <>
                              
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black z-50"
                                    onClick={() => setShowFilters(false)}
                                />

                               
                                <motion.div
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl z-50 p-6"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">Filter Jobs</h2>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setShowFilters(false)}
                                        >
                                            <ChevronUp size={24} />
                                        </Button>
                                    </div>
                                    <FilterCard />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                        {filterJobs.length <= 0 ? (
                            <div className='text-center text-gray-500 mt-10'>
                                No jobs found
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;