import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, X } from 'lucide-react';
import { fetchAllCompanies } from '@/store/companySlice';
import { useNavigate } from 'react-router-dom';
import { createJob } from '@/store/jobSlice';
import CoordinatorHeader from '@/components/shared/CoordinatorHeader';
import { toast } from 'react-toastify';

const JobCreation = () => {
    const dispatch = useDispatch();
    const { allCompanies, loading: companiesLoading } = useSelector((state) => state.companySlice);
    const { user } = useSelector((state) => state.authSlice);
    const [showCompanyDialog, setShowCompanyDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [errors, setErrors] = useState({});
    const jobTypes = ['Full-time', 'Remote', '2M-Intern', '6M-Intern', 'Intern+PPO', 'Intern+FTE'];
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: [''],
        salary: '',
        location: [''],
        jobType: '',
        position: '',
        deadline: new Date(),
        company: '',
        recruiter: ''
    });


    // console.log(formData);

    // console.log(selectedRecruiter);

    useEffect(() => {
        if (user && user.role !== 'coordinator') {
            toast.error("You are not allowed to view this page")
            navigate('/')
        }
    }, [])

    useEffect(() => {
        dispatch(fetchAllCompanies());
    }, [dispatch]);

    //  company selection and recruiter auto-fill
    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        setFormData({
            ...formData,
            company: company._id,
            recruiter: company.createdBy._id
        });
        setSelectedRecruiter(company.createdBy.name);
        setShowCompanyDialog(false);
    };



    //   input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        //clear error
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // select changes
    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // date selection
    const handleDateSelect = (date) => {
        setFormData({
            ...formData,
            deadline: date
        });

        if (errors.deadline) {
            setErrors({
                ...errors,
                deadline: ''
            });
        }
    };

    // requirements array
    const handleRequirementChange = (index, value) => {
        const updatedRequirements = [...formData.requirements];
        updatedRequirements[index] = value;

        setFormData({
            ...formData,
            requirements: updatedRequirements
        });
    };

    //  new requirement field
    const addRequirementField = () => {
        setFormData({
            ...formData,
            requirements: [...formData.requirements, '']
        });
    };

    //remove requirement field
    const removeRequirementField = (index) => {
        const updatedRequirements = [...formData.requirements];
        updatedRequirements.splice(index, 1);

        setFormData({
            ...formData,
            requirements: updatedRequirements
        });
    };

    // locations array
    const handleLocationChange = (index, value) => {
        const updatedLocations = [...formData.location];
        updatedLocations[index] = value;

        setFormData({
            ...formData,
            location: updatedLocations
        });
    };

    // Add new location field
    const addLocationField = () => {
        setFormData({
            ...formData,
            location: [...formData.location, '']
        });
    };

    // Remove location field
    const removeLocationField = (index) => {
        const updatedLocations = [...formData.location];
        updatedLocations.splice(index, 1);

        setFormData({
            ...formData,
            location: updatedLocations
        });
    };

    // validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.salary.trim()) newErrors.salary = 'Salary is required';
        if (!formData.jobType) newErrors.jobType = 'Job type is required';
        if (!formData.position || formData.position <= 0) {
            newErrors.position = 'Valid position count is required';
        }
        if (!formData.company) newErrors.company = 'Company is required';
        if (!formData.recruiter) newErrors.recruiter = 'Recruiter is required';



        // at least one valid location
        const validLocations = formData.location.filter(loc => loc.trim() !== '');
        if (validLocations.length === 0) {
            newErrors.location = 'At least one location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
        // returns true -> i can proceed

    };

    const clearFormData = () => {
        return {
            title: '',
            description: '',
            requirements: [''],
            salary: '',
            location: [''],
            jobType: '',
            position: '',
            deadline: new Date(),
            company: '',
            recruiter: ''

        };
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // filter out empty requirements and locations
            const cleanedFormData = {
                ...formData,
                requirements: formData.requirements.filter(req => req.trim() !== ''),
                location: formData.location.filter(loc => loc.trim() !== ''),
                createdBy: user._id
            };

            //disaptch
            dispatch(createJob(cleanedFormData)).then((data) => {

                if (data?.payload?.success) {
                    toast.success("Created job successfully");
                    setFormData(clearFormData());
                    setSelectedRecruiter(null)
                    setSelectedCompany(null)
                } else {
                    toast.error(data?.payload || "Failed, Try again.");
                }
            });


        }
    };

    return (
        <div className='mt-18'>
            <CoordinatorHeader />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Create New Job Posting</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Job Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer"
                                    className={errors.title ? "border-red-500" : ""}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jobType">Job Type *</Label>
                                <Select
                                    value={formData.jobType}
                                    onValueChange={(value) => handleSelectChange('jobType', value)}
                                >
                                    <SelectTrigger className={errors.jobType ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.jobType && <p className="text-red-500 text-sm">{errors.jobType}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary *</Label>
                                <Input
                                    id="salary"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. 15lpa"
                                    className={errors.salary ? "border-red-500" : ""}
                                />
                                {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">Number of Positions *</Label>
                                <Input
                                    id="position"
                                    name="position"
                                    type="number"
                                    min="1"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g. 3"
                                    className={errors.position ? "border-red-500" : ""}
                                />
                                {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Application Deadline *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`w-full justify-start text-left font-normal ${errors.deadline ? "border-red-500" : ""}`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : "Select a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.deadline}
                                            onSelect={handleDateSelect}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Company *</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${errors.company ? "border-red-500" : ""}`}
                                        onClick={() => setShowCompanyDialog(true)}
                                    >
                                        {selectedCompany ? selectedCompany.name : "Select a company"}
                                    </Button>
                                </div>
                                {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Recruiter *</Label>
                                <div className="flex gap-2">
                                    <Input
                                      
                                      value={selectedRecruiter || ""}
                                      readOnly
                                        className={errors.recruiter ? "border-red-500" : ""}
                                    />
                                </div>
                                {errors.recruiter && <p className="text-red-500 text-sm">{errors.recruiter}</p>}
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter detailed job description"
                                rows={6}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>


                        <div className="space-y-2 mt-6">
                            <div className="flex justify-between items-center">
                                <Label>Requirements</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={addRequirementField}
                                    className="flex items-center text-blue-600"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" /> Add Requirement
                                </Button>
                            </div>

                            {formData.requirements.map((requirement, index) => (
                                <div key={`req-${index}`} className="flex gap-2 mt-2">
                                    <Input
                                        value={requirement}
                                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                                        placeholder={`Requirement ${index + 1}`}
                                        className={errors.requirements && index === 0 ? "border-red-500" : ""}
                                    />
                                    {formData.requirements.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRequirementField(index)}
                                            className="text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements}</p>}
                        </div>


                        <div className="space-y-2 mt-6">
                            <div className="flex justify-between items-center">
                                <Label>Locations *</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={addLocationField}
                                    className="flex items-center text-blue-600"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" /> Add Location
                                </Button>
                            </div>

                            {formData.location.map((location, index) => (
                                <div key={`loc-${index}`} className="flex gap-2 mt-2">
                                    <Input
                                        value={location}
                                        onChange={(e) => handleLocationChange(index, e.target.value)}
                                        placeholder={`Location ${index + 1}`}
                                        className={errors.location && index === 0 ? "border-red-500" : ""}
                                    />
                                    {formData.location.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLocationField(index)}
                                            className="text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                        </div>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button className="cursor-pointer" type="button" variant="outline">Cancel</Button>
                        <Button className="cursor-pointer" type="submit">Create Job</Button>
                    </div>
                </form>


                <Dialog open={showCompanyDialog} onOpenChange={
                    (showCompanyDialog) => !showCompanyDialog && setShowCompanyDialog(false)
                }>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Select Company and Recruiter</DialogTitle>
                        </DialogHeader>

                        {companiesLoading ? (
                            <div className="flex justify-center p-6">
                                <p>Loading allCompanies...</p>
                            </div>
                        ) : (
                            <>
                                {allCompanies && allCompanies.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        {allCompanies.map((company) => (
                                            <Card
                                                key={company._id}
                                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => handleCompanySelect(company)}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    {company.logo ? (
                                                        <img src={company.logo} alt={company.name} className="h-10 w-10 object-contain" />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-500 font-bold">{company.name.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium">{company.name}</h3>
                                                    </div>
                                                </div>

                                                <div className="text-sm">
                                                    <p className="text-gray-500">
                                                        Recruiter: {company.createdBy ? company.createdBy.name : "NA"}
                                                    </p>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center p-6">
                                        <p>No allCompanies found. Please add a company first.</p>
                                    </div>
                                )}
                            </>
                        )}

                        <DialogFooter>
                            <Button className="cursor-pointer" variant="outline" onClick={() => setShowCompanyDialog(false)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default JobCreation;