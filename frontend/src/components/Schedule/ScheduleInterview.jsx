import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { createSchedule } from '@/store/scheduleSlice';

const ScheduleInterview = ({ isOpen, onClose, studentId, jobId, studentName, jobTitle }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleDateSelect = (newdate) => {
        setFormData((prev) => ({
            ...prev,
            date: newdate
        }))

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createSchedule({ jobId, studentId, formData })).then((data) => {
            if (data?.payload?.success) {
                toast.success("Createed schedule successfully!");
                onClose()
            } else {
                toast.error(data?.payload || "Failed to create");
                onClose()
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-1">
                        <div className="text-sm font-medium">Student:</div>
                        <div className="text-sm">{studentName}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm font-medium">Position:</div>
                        <div className="text-sm">{jobTitle}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <Label>Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? new Date(formData.date).toLocaleDateString() : "Select a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        required
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>

                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="time">Time *</Label>
                            <Input
                                id="time"
                                name="time"
                                type="text"
                                placeholder="e.g. 2:30 PM"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Online/CCD room/CSE"
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" className="cursor-pointer" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="cursor-pointer" type="submit">
                            Schedule Interview
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleInterview;