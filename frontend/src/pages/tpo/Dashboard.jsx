import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Loader2, Search, UserCheck, UserX, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { acceptApproval, deleteApproval, fetchPendingApprovals } from '@/store/authSlice';
import Header from '@/components/shared/Header';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user: currentUser, pendingApprovals, approvalLoading } = useSelector(state => state.authSlice);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', userId: null });
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.role !== 'tpo') {
            toast.error('Only TPO can access this dashboard');
            navigate('/');
            return;
        }
        dispatch(fetchPendingApprovals());
    }, [currentUser, dispatch, navigate]);

    const handleApproveUser = async (userId) => {

        setActionLoading(true);
        try {
            dispatch(acceptApproval(userId))
                .then((data) => {
                    if (data?.payload?.success) {
                        toast.success('User approved successfully');
                    }
                })
                .catch((error) => {
                    toast.error('Failed to approve user');
                });
        } finally {
            setActionLoading(false);
            setConfirmDialog({ isOpen: false, type: '', userId: null });
        }
    };

    const handleRejectUser = async (userId) => {
        setActionLoading(true);
        try {
            dispatch(deleteApproval(userId))
                .then((data) => {
                    if (data?.payload?.success) {
                        toast.success('User rejected successfully');
                    }
                })
                .catch((error) => {
                    toast.error('Failed to reject user');
                });
        } finally {
            setActionLoading(false);
            setConfirmDialog({ isOpen: false, type: '', userId: null });
        }
    };

    //filter users based on search term and role
    const filteredPendingUsers = pendingApprovals.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

    //get user initials for avatar fallback
    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };


    const getRoleBadgeStyles = (role) => {
        switch (role.toLowerCase()) {
            case 'student':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'faculty':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'recruiter':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className='mt-18'>
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">TPO Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage user registration requests</p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <span className="text-sm text-gray-600">
                            Logged in as:{' '}
                            <span className="font-medium">{currentUser?.name}</span>
                        </span>
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">TPO</Badge>
                    </div>
                </div>


                {/* searching and filter*/}

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-2 w-full"
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="cursor-pointer w-full sm:w-auto flex items-center gap-2">
                                <Filter size={16} />
                                Filter by Role
                                <ChevronDown size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                            <div className="space-y-2">
                               
                                <div className="space-y-1">
                                    <Button
                                        variant={filterRole === 'all' ? 'default' : 'ghost'}
                                        size="sm"
                                        className="w-full cursor-pointer"
                                        onClick={() => setFilterRole('all')}
                                    >
                                        All Roles
                                    </Button>
                                    <Button
                                        variant={filterRole === 'student' ? 'default' : 'ghost'}
                                        size="sm"
                                        className="w-full cursor-pointer"
                                        onClick={() => setFilterRole('student')}
                                    >
                                        Student
                                    </Button>
                                    <Button
                                        variant={filterRole === 'coordinator' ? 'default' : 'ghost'}
                                        size="sm"
                                        className="w-full cursor-pointer"
                                        onClick={() => setFilterRole('coordinator')}
                                    >
                                        Coordinator
                                    </Button>
                                    <Button
                                        variant={filterRole === 'recruiter' ? 'default' : 'ghost'}
                                        size="sm"
                                        className="w-full cursor-pointer"
                                        onClick={() => setFilterRole('recruiter')}
                                    >
                                        Recruiter
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="bg-white mb-6 w-full">
                        <TabsTrigger
                            value="pending"
                            className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                        >
                            <Clock size={16} className="mr-2" />
                            Pending Approvals
                            <Badge variant="outline" className="ml-2 bg-gray-100">{pendingApprovals.length}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-0">
                        {approvalLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                                <p className="text-gray-600">Loading pending users...</p>
                            </div>
                        ) : filteredPendingUsers.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                                {searchTerm || filterRole !== 'all' ? (
                                    <div className="flex flex-col items-center">
                                        <Search className="h-12 w-12 text-gray-400 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No matching users found</h3>
                                        <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                                        <Button
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilterRole('all');
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <UserCheck className="h-12 w-12 text-gray-400 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No pending approvals</h3>
                                        <p className="text-gray-500">All user requests have been processed</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPendingUsers.map((user) => (
                                    <Card key={user._id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-800">
                                                            {getUserInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">{user.name}</CardTitle>
                                                        <CardDescription className="text-sm">{user.email}</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge className={getRoleBadgeStyles(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-gray-500">
                                                <p>Applied: {formatDate(user.createdAt)}</p>
                                                
                                            </div>
                                        </CardContent>
                                        <CardFooter className="grid grid-cols-2 gap-2 pt-2 border-t">
                                            <Button
                                                variant="ghost"
                                                className="cursor-pointer text-red-600 hover:text-red-800 hover:bg-red-50"
                                                onClick={() => setConfirmDialog({
                                                    isOpen: true,
                                                    type: 'reject',
                                                    userId: user._id
                                                })}
                                            >
                                                <UserX size={16} className="mr-2" />
                                                Reject
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="cursor-pointer text-green-600 hover:text-green-800 hover:bg-green-50"
                                                onClick={() => setConfirmDialog({
                                                    isOpen: true,
                                                    type: 'approve',
                                                    userId: user._id
                                                })}
                                            >
                                                <UserCheck size={16} className="mr-2" />
                                                Approve
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>


                <Dialog
                    open={confirmDialog.isOpen}
                    onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, type: '', userId: null })}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {confirmDialog.type === 'approve' ? 'Approve User' : 'Reject User'}
                            </DialogTitle>
                            <DialogDescription>
                                {confirmDialog.type === 'approve'
                                    ? 'Are you sure you want to approve this user? They will be granted access to the platform.'
                                    : 'Are you sure you want to reject this user? This action cannot be undone.'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setConfirmDialog({ isOpen: false, type: '', userId: null })}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={confirmDialog.type === 'approve' ? 'default' : 'destructive'}
                                onClick={() => {
                                    if (confirmDialog.type === 'approve') {
                                        handleApproveUser(confirmDialog.userId);
                                    } else {
                                        handleRejectUser(confirmDialog.userId);
                                    }
                                }}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {confirmDialog.type === 'approve' ? 'Approving...' : 'Rejecting...'}
                                    </>
                                ) : (
                                    <>
                                        {confirmDialog.type === 'approve' ? (
                                            <>
                                                <UserCheck className="mr-2 h-4 w-4" />
                                                Approve
                                            </>
                                        ) : (
                                            <>
                                                <UserX className="mr-2 h-4 w-4" />
                                                Reject
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Dashboard;