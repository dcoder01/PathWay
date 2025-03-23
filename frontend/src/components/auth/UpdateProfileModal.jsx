import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'react-toastify';
import { updateProfile } from '@/store/authSlice';

const UpdateProfileModal = ({ open, setOpen }) => {
    const { user, loading } = useSelector((state) => state.authSlice);
    const [input, setInput] = useState({
        fullName: user?.profile?.fullName || "",
        dob: user?.profile?.dob || "",
        workEmail: user?.profile?.workEmail || "",
        phone: user?.profile?.phone || "",
        enrollment: user?.profile?.enrollment || "",
        registration: user?.profile?.registration || "",
        branch: user?.profile?.branch || "",
        cgpa: user?.profile?.cgpa || "",
        address: user?.profile?.address || "",
        gender: user?.profile?.gender || "",
        gapYear: user?.profile?.gapYear || "",
        tenthPercentage: user?.profile?.tenthPercentage || "",
        twelfthPercentage: user?.profile?.twelfthPercentage || "",
        activeBacklogs: user?.profile?.activeBacklogs || "",
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleGenderChange = (value) => {
        setInput({ ...input, gender: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(updateProfile(input)).then((data) => {
            if (data?.payload?.success) {
                toast.success("Updated profile successfully!");
            } else {
                toast.error(data?.payload || "update failed.");
            }
        });
        setOpen(false);
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        {Object.keys(input).map((key) => (
                            <div key={key} className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor={key} className='text-right capitalize'>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                
                                {key === 'gender' ? (
                                    <div className="col-span-3">
                                        <Select 
                                            value={input.gender} 
                                            onValueChange={handleGenderChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : key === 'dob' ? (
                                    <Input
                                        id={key}
                                        name={key}
                                        type="date"
                                        value={input[key]}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                        style={{ scrollbarWidth: 'thin' }}
                                    />
                                ) : (
                                    <Input
                                        id={key}
                                        name={key}
                                        type="text"
                                        value={input[key]}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        {loading ? (
                            <Button className='w-full my-4'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type='submit' className='w-full my-4'>Update</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileModal;