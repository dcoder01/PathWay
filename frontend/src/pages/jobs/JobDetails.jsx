import React, { useEffect, useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSingleJob } from '@/store/jobSlice'
import {
    MapPin,
    Calendar,
    IndianRupee,
    Briefcase,
    Users,
    ArrowRight,
    Clock,
    UserRoundCog,
    Pin,
    Monitor

} from 'lucide-react'
import Header from '@/components/shared/Header'

const JobDetails = () => {
    const { singleJob } = useSelector(state => state.jobSlice)
    const { user } = useSelector(state => state.authSlice)
    const isInitiallyApplied = singleJob?.applications?.some(application => application.student === user?._id) || false
    const [isApplied, setIsApplied] = useState(isInitiallyApplied)
    const params = useParams()
    const jobId = params.jobId
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchSingleJob(jobId));
    }, [jobId, dispatch]);

    useEffect(() => {
        if (singleJob && user) {
            setIsApplied(singleJob?.applications?.some(application => application.student === user?._id));
        }
    }, [singleJob, user]);


    const JobDetailCard = ({ icon: Icon, title, content }) => (
        <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-4">
            <Icon className="h-6 w-6  mt-1 flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-600">{content}</p>
            </div>
        </div>
    )

    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto my-18 px-4 lg:px-0">
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                {singleJob?.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-2 text-blue-700"
                                >
                                    <Briefcase className="h-4 w-4" />
                                    {singleJob?.position} Positions
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-2 text-red-600"
                                >
                                    <Users className="h-4 w-4" />
                                    {singleJob?.jobType}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-2 text-green-600"
                                >
                                    <IndianRupee className="h-4 w-4" />
                                    {singleJob?.salary}
                                </Badge>
                            </div>
                        </div>
                        {user && user.role !== 'tpo' && (
                            <Button
                                onClick={isApplied ? null : () => navigate(`/apply/${jobId}`)}
                                disabled={isApplied}
                                className={`cursor-pointer mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center ${isApplied
                                    ? 'bg-gray-500 hover:bg-gray-600'
                                    : 'bg-black hover:bg-gray-500'
                                    }`}
                            >
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                                {!isApplied && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        )}
                    </div>


                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <JobDetailCard
                            icon={MapPin}
                            title="Location"
                            content={singleJob?.location ? singleJob.location.join(", ") : "Not specified"}
                        />
                        <JobDetailCard
                            icon={Calendar}
                            title="Posted Date"
                            content={singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "N/A"}
                        />
                        <JobDetailCard
                            icon={Users}
                            title="Total Applicants"
                            content={singleJob?.applications?.length || 0}
                        />
                        <JobDetailCard
                            icon={IndianRupee}
                            title="Salary"
                            content={singleJob?.salary || "Not specified"}
                        />
                        <JobDetailCard
                            icon={Clock}
                            title="Deadline"
                            content={singleJob?.deadline ? new Date(singleJob.deadline).toLocaleDateString() : "N/A"}
                        />
                        <JobDetailCard
                            icon={Monitor}
                            title="Requirements"
                            content={singleJob?.requirements ? singleJob?.requirements.join(", ") : "Not specified"}
                        />
                        <JobDetailCard
                            icon={UserRoundCog}
                            title="Coordinator"
                            content={singleJob?.createdBy.name || "Not specified"}
                        />
                        <JobDetailCard
                            icon={Pin}
                            title="Recruiter"
                            content={singleJob?.recruiter.name || "Not specified"}
                        />
                    </div>


                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                            Job Description
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {singleJob?.description}
                        </p>
                    </div>


                    {singleJob?.company && (
                        <div className="bg-gray-50 rounded-lg p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Company Details</h2>
                            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                                <img
                                    src={singleJob.company.logo}
                                    alt="Company Logo"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {singleJob.company.name}
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        {singleJob.company.description}
                                    </p>
                                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{singleJob.company.location?.join(", ")}</span>
                                    </div>
                                    <a
                                        href={singleJob.company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=" hover:underline flex items-center"
                                    >
                                        Visit Website <ArrowRight className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobDetails