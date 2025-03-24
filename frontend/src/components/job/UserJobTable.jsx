import React, { useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppliedJobs } from '@/store/jobSlice/index.js';
import Header from '../shared/Header';
import { useNavigate } from 'react-router-dom';


const statusColors = {
    applied: 'bg-blue-400',
    oa: 'bg-purple-400',
    interview: 'bg-yellow-400',
    accepted: 'bg-green-400',
    rejected: 'bg-red-400',
};

const UserJobTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { appliedJobs, isLoading } = useSelector((state) => state.jobSlice);
    const { user } = useSelector((state) => state.authSlice)

    useEffect(() => {
        if (user && user.role !== 'student') {
            navigate('/home')

        }
    }, [])

    useEffect(() => {
        dispatch(fetchAppliedJobs());
    }, [dispatch]);

    return (
        <>
            <Header />
            <div className='my-18 p-4 shadow-2xl'>
                <Table>
                    <TableCaption>A list of your applied jobs</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Job Role</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    isLoading...
                                </TableCell>
                            </TableRow>
                        ) : appliedJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    You haven't applied to any jobs yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appliedJobs.map((appliedJob) => (
                                <TableRow key={appliedJob._id}>
                                    <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell>{appliedJob.job?.title}</TableCell>
                                    <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={statusColors[appliedJob?.status] || 'bg-gray-400'}>
                                            {appliedJob.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>


        </>
    );
};

export default UserJobTable;
