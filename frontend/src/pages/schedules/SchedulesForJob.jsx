import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertCircle,
  CalendarIcon,
  MoreVertical,
  Trash2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";

import { deleteSchedule, fetchSchedulesCoordinator, updateSchedule } from '@/store/scheduleSlice';
import SearchBar from '@/components/shared/SearchBar';
import CoordinatorHeader from '@/components/shared/CoordinatorHeader';
import { toast } from 'react-toastify';


const SchedulesForJob = () => {
  const location = useLocation();
  const [compnayName, setCompanyName] = useState('');
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const company = query.get("company");
    if (company) {
      setCompanyName(company);
    }
  }, [location.search]);

  const { jobId } = useParams();
  const dispatch = useDispatch();

  const { coordinatorSchedules } = useSelector(state => state.scheduleSlice);
  const { applicants: jobDetails } = useSelector((state) => state.jobSlice);


  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [input, setInput] = useState("");
  const [schedules, setSchedules] = useState([])
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: ''
  });
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  //fetching the schedules
  useEffect(() => {
    if (jobId) {
      dispatch(fetchSchedulesCoordinator(jobId));
    }
  }, [dispatch, jobId]);

  //input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  //date change
  const handleDateSelect = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };
  //open dialog
  const openUpdateDialog = (schedule) => {
    setSelectedSchedule(schedule);

    setFormData({
      date: schedule.date || '',
      time: schedule.time || '',
      location: schedule.location || ''
    });

    setIsUpdateDialogOpen(true);
  };
  //close dialog
  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedSchedule(null);
  };
  //submitting update
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!selectedSchedule) return;

    dispatch(updateSchedule({ scheduleId: selectedSchedule._id, formData })).then((data) => {


      if (data?.payload?.success) {
        toast.success("updated successfully!");
        dispatch(fetchSchedulesCoordinator(jobId))
        closeUpdateDialog();
      } else {
        toast.error(data?.payload || "update failed! Try again.");
      }
    });

  };


  //delete
  const handleDeleteSchedule = () => {
    if (deleteScheduleId) {
      dispatch(deleteSchedule(deleteScheduleId)).then((data) => {
        if (data?.payload?.success) {
          toast.success("Schedule deleted successfully!");
          dispatch(fetchSchedulesCoordinator(jobId));
        } else {
          toast.error(data?.payload || "Failed to delete, try again.");
        }
        setDeleteScheduleId(null);
      });
    }
  };
  //popen popover
  const handleDeleteClick = (scheduleId) => {
    setDeleteScheduleId(scheduleId);
    setIsPopoverOpen(true);
  };
  //close popover
  const handleCancelDelete = () => {
    setDeleteScheduleId(null);
    setIsPopoverOpen(false);
  };

  //filter
  useEffect(() => {
    if (input) {
      setSchedules(
        coordinatorSchedules.filter(sch =>
          sch.student.name.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setSchedules(coordinatorSchedules);
    }
  }, [coordinatorSchedules, input]);


  return (
    <div className='mt-18'>
      <CoordinatorHeader />
      <div className="mx-auto max-w-7xl px-4">

        <SearchBar
          input={input}
          settingInput={setInput}
          text="filter by student name"
        />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Schedules for: {compnayName ? compnayName : 'Job'}
          </h1>

        </div>

        {schedules && schedules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule._id}>
                  <TableCell>
                    <div>
                      <p>{schedule.student.name}</p>
                      <p>{schedule.student.email}</p>
                    </div>

                  </TableCell>
                  <TableCell>
                    {new Date(schedule.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {schedule.time}
                  </TableCell>
                  <TableCell>{schedule.location}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60">
                        <div className="space-y-2">
                          <div className="font-medium text-md">Actions</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full cursor-pointer justify-start hover:bg-gray-300"
                            onClick={() => openUpdateDialog(schedule)}
                          >
                            <CalendarIcon className="h-3 w-3 mr-2" />
                            Update Schedule
                          </Button>
                          <div className="border-t cursor-pointer my-2"></div>
                          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(schedule._id)}
                                className="cursor-pointer justify-start hover:bg-gray-300 text-red-600"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete Schedule
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4">
                              <div className="text-sm font-medium">Are you sure?</div>
                              <p className="text-xs text-gray-500">This action cannot be undone.</p>
                              <div className="flex justify-end space-x-2 mt-3">
                                <Button variant="outline" className='cursor-pointer' size="sm" onClick={handleCancelDelete}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" className='cursor-pointer' size="sm" onClick={handleDeleteSchedule}>
                                  Delete
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>

                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex mt-4 items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-800">
          <AlertCircle className="w-6 h-6 mr-2" />
          <p>No schedules found for this job.</p>
        </div>
        )}

        <Dialog open={isUpdateDialogOpen} onOpenChange={closeUpdateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Interview Schedule</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 py-2">
              {selectedSchedule && (
                <>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Student:</div>
                    <div className="text-sm">{selectedSchedule.student.name}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Position:</div>
                    <div className="text-sm">{jobDetails?.title}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
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
                      placeholder="Online/CCD/CSE"
                      required
                    />
                  </div>
                </>
              )}

              <DialogFooter className="pt-4">
                <Button type="button" className="cursor-pointer" variant="outline" onClick={closeUpdateDialog}>
                  Cancel
                </Button>
                <Button className="cursor-pointer" type="submit">
                  Update Schedule
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SchedulesForJob;