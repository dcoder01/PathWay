import React, { useState } from 'react';
import Navbar from '../shared/Header';
import { Avatar, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useSelector } from 'react-redux';
import { Contact, Mail, Pen } from 'lucide-react';
import UpdateProfileModal from './UpdateProfileModal';

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.authSlice);
    const profile = user?.profile || {};

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-20 p-4'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{profile.fullName || 'NA'}</h1>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right cursor-pointer" variant="outline" alt="update">
                        <Pen />
                    </Button>
                </div>
                <div className='my-5 space-y-3'>
                    <div className='flex items-center gap-3'><Mail /> <span>{profile.workEmail || 'NA'}</span></div>
                    <div className='flex items-center gap-3'><Contact /> <span>{profile.phone || 'NA'}</span></div>
                    <div><Label>Enrollment:</Label> <span>{profile.enrollment || 'NA'}</span></div>
                    <div><Label>Registration:</Label> <span>{profile.registration || 'NA'}</span></div>
                    <div><Label>Branch:</Label> <span>{profile.branch || 'NA'}</span></div>
                    <div><Label>CGPA:</Label> <span>{profile.cgpa || 'NA'}</span></div>
                    <div><Label>Gender:</Label> <span>{profile.gender || 'NA'}</span></div>
                    <div><Label>Date of Birth:</Label> <span>{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'NA'}</span></div>
                    <div><Label>Address:</Label> <span>{profile.address || 'NA'}</span></div>
                    <div><Label>Gap Year:</Label> <span>{profile.gapYear || 'NA'}</span></div>
                    <div><Label>10th Percentage:</Label> <span>{profile.tenthPercentage || 'NA'}</span></div>
                    <div><Label>12th Percentage:</Label> <span>{profile.twelfthPercentage || 'NA'}</span></div>
                    <div><Label>Active Backlogs:</Label> <span>{profile.activeBacklogs || 'NA'}</span></div>

                </div>
            </div>
            <UpdateProfileModal open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
