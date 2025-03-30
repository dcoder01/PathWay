import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();
    
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };
    
    return (
        <div className="flex flex-col h-full p-4 sm:p-5 rounded-lg shadow-lg bg-white border border-gray-200 w-full">
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
                    <p className="text-xs sm:text-sm text-gray-500">India</p>
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
            
            <div className="mt-4">
                <Button className='w-full cursor-pointer' onClick={() => navigate(`/description/${job?._id}`)}>
                    Details
                </Button>
            </div>
        </div>
    );
};

export default Job;