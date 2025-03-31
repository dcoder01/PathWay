import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchCoordinatorJobs } from '@/store/jobSlice';
import CoordinatorHeader from '@/components/shared/CoordinatorHeader';
import SearchBar from '@/components/shared/SearchBar';
import { AlertCircle } from 'lucide-react';

const CoordinatorJobListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { coordinatorJobs, loading, error } = useSelector((state) => state.jobSlice);
    const [input, setInput] = useState("");
    const [jobs, setJobs] = useState([])
    useEffect(() => {
        dispatch(fetchCoordinatorJobs());
    }, [dispatch]);

    useEffect(() => {
        if (input) {
            setJobs(
                coordinatorJobs.filter(job =>
                    job.company.name.toLowerCase().includes(input.toLowerCase())
                )
            );
        } else {
            setJobs(coordinatorJobs);
        }
    }, [coordinatorJobs, input]);

    const daysAgoFunction = (dateString) => {
        const createdDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - createdDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleViewSchedule = (jobId) => {
        navigate(`/fetch-schedules/${jobId}`);
    };

    const handleViewApplicants = (jobId) => {
        navigate(`/job-applicants/${jobId}`);
    };

    if (loading) return <div className="text-center py-10">Loading jobs...</div>;
    if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

    return (
        <div className='mt-16'>
            <CoordinatorHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <SearchBar
                    input={input}
                    settingInput={setInput}
                    text="filter by company name"
                />
                <div className='text-left mb-2'>
                    <h1 className="text-2xl font-bold mb-6">Jobs created by you</h1>
                    <p>Create, update & delete schedules</p>
                    <p>update status</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

                    {jobs && jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job._id} className="flex flex-col h-full p-4 sm:p-5 rounded-lg shadow-lg bg-white border border-gray-200 w-full">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 my-3">
                                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                                        <AvatarImage src={job?.company?.logo} />
                                    </Avatar>
                                    <div>
                                        <h1 className="font-medium text-base sm:text-lg">{job?.company?.name}</h1>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {job?.location?.join(', ') || 'India'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <h1 className="font-bold text-base sm:text-lg my-2">{job?.title}</h1>
                                    <p className="text-sm text-gray-600 line-clamp-2 h-10">{job?.description}</p>
                                </div>

                                <div className="mt-4 min-h-[32px]">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="text-blue-700 font-bold" variant="ghost">{job?.position} Positions</Badge>
                                        <Badge className="text-red-600 font-bold" variant="ghost">{job?.jobType}</Badge>
                                        <Badge className="text-purple-700 font-bold" variant="ghost">{job?.salary}</Badge>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Button
                                        className="w-full cursor-pointer bg-black hover:bg-gray-800"
                                        onClick={() => handleViewSchedule(job?._id)}
                                    >
                                        View Schedules
                                    </Button>
                                    <Button
                                        className="w-full cursor-pointer  hover:bg-gray-400"
                                        variant="outline"
                                        onClick={() => handleViewApplicants(job?._id)}
                                    >
                                        View Applicants ({job?.applications?.length || 0})
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-800">
                                <AlertCircle className="w-6 h-6 mr-2" />
                                <p>No Jobs Found.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoordinatorJobListing;