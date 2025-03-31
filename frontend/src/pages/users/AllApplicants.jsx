import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar } from 'lucide-react';
// import ScheduleInterview from './ScheduleInterview'; // Component for scheduling
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { fetchAllApplicants, updateStatus } from '@/store/jobSlice';
import { toast } from 'react-toastify';
import CoordinatorHeader from '@/components/shared/CoordinatorHeader';
import ScheduleInterview from '@/components/job/ScheduleInterview';

const AllApplicants = () => {
  const dispatch = useDispatch();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const params = useParams()
  const { jobId } = params
  const { applicants, loading, error } = useSelector((state) => state.jobSlice);




  const navigate = useNavigate()
  const { user } = useSelector((state) => state.authSlice)
  useEffect(() => {
    if (user && user.role !== 'coordinator' && user.role !== 'recruiter') {
      toast.error('you are not allowed')
      navigate('/')
    }
  }, [])
  useEffect(() => {
    dispatch(fetchAllApplicants(jobId));
  }, [dispatch, jobId]);


  const applications = applicants?.applications || [];

  //status update

  const handleStatusUpdate = (applicationId, newStatus) => {
    dispatch(updateStatus({ applicationId, status: newStatus })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Updated status successfully!");
        dispatch(fetchAllApplicants(jobId));
      } else {
        toast.error(data?.payload || "Failed to updateStatus");
      }
    });
  };

  const openScheduleDialog = (applicant) => {
    setSelectedApplicant(applicant);
    setShowSchedule(true);
  };

  const closeScheduleDialog = () => {
    setShowSchedule(false);
    setSelectedApplicant(null);
  };

  if (loading) return <div className="flex justify-center p-8">Loading applicants...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!applicants) return <div className="p-4">No job data found</div>;



  return (
    <div className='mt-18'>
      <CoordinatorHeader />
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job: {applicants.title}</h1>
          <div className="text-sm text-gray-500">
            {applications.length} {applications.length === 1 ? 'Applicant' : 'Applicants'}
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No applicants yet for this position.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {application.student.profile.fullName || application.student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.student.profile.branch || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.student.email}</div>
                      <div className="text-sm text-gray-500">{application.student.profile.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.student.profile.cgpa || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                application.status === 'oa' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.resume ? (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400">No resume</span>
                      )}
                    </td>
                    <td className=" px-6 py-4 whitespace-nowrap text-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost"  className="cursor-pointer" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60">
                          <div className="space-y-2">
                            <div className="font-medium text-md">Update Status</div>
                            <div className="space-y-1">
                              {['applied', 'oa', 'interview', 'accepted', 'rejected'].map((status) => (
                                <Button
                                  key={status}
                                  variant="ghost"
                                  size="sm"
                                  className="w-full cursor-pointer justify-start hover:bg-gray-300"
                                  onClick={() => handleStatusUpdate(application._id, status)}
                                  disabled={application.status === status}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Button>
                              ))}
                            </div>
                            <div className=" border-t my-2"></div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full cursor-pointer justify-start  hover:bg-gray-300 "
                              onClick={() => openScheduleDialog(application)}
                            >
                              <Calendar className="h-3 w-3 mr-2" />
                              Schedule Interview
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showSchedule && selectedApplicant && (
          <ScheduleInterview
            isOpen={showSchedule}
            onClose={closeScheduleDialog}
            studentId={selectedApplicant.student._id}
            jobId={jobId}
            studentName={selectedApplicant.student.profile.fullName || selectedApplicant.student.name}
            jobTitle={applicants.title}
          />
        )}
      </div>
    </div>
  );
};

export default AllApplicants;