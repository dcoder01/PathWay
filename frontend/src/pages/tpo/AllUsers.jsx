import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";
import { Loader2, AlertCircle, UserIcon, MailIcon, CalendarIcon, ShieldCheck, Award } from "lucide-react";
import { getAllUsers } from "@/store/authSlice";
import { Badge } from "../../components/ui/badge";
import Header from "@/components/shared/Header";

const AllUsers = () => {
    const dispatch = useDispatch();
    const { allUsers, loading, error } = useSelector((state) => state.authSlice);

    useEffect(() => {
        if (allUsers.length === 0) {
            dispatch(getAllUsers());
        }
    }, [dispatch, allUsers.length]);

    const getRoleBadgeColor = (role) => {
        switch (role.toLowerCase()) {
            case 'recruiter': return "bg-purple-100 text-purple-800 border-purple-300";
            case 'tpo': return "bg-blue-100 text-blue-800 border-blue-300";
            case 'coordinator': return "bg-green-100 text-green-800 border-green-300";
            case 'student': return "bg-yellow-100 text-yellow-800 border-yellow-300";
            default: return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
        <div className="mt-18">
             <Header />
            <div className="max-w-6xl mx-auto my-8 px-4">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
                    <Badge variant="outline" className="px-3 py-1">
                        {allUsers.length} User{allUsers.length !== 1 && 's'}
                    </Badge>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
                        <p className="text-gray-500">Loading users...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 flex items-center">
                        <AlertCircle className="mr-3 flex-shrink-0" size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && allUsers.length === 0 && (
                    <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
                        <UserIcon className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-xl font-medium text-gray-700">No users found</h3>
                        <p className="text-gray-500 mt-2">There are currently no users in the system.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allUsers && allUsers.map((user) => (
                        <Card key={user._id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className={`h-2 ${getRoleBadgeColor(user.role).split(' ')[0]}`}></div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{user.name}</CardTitle>
                                    <Badge variant="outline" className={`${getRoleBadgeColor(user.role)} text-xs`}>
                                        {user.role}
                                    </Badge>
                                </div>
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <MailIcon size={14} className="mr-1" />
                                    {user.email}
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        <ShieldCheck size={16} className="mr-2 text-gray-500" />
                                        <span className="font-medium mr-2">Status:</span>
                                        {user.isApproved ? (
                                            <span className="text-green-600 flex items-center">
                                                Approved <Award className="ml-1" size={14} />
                                            </span>
                                        ) : (
                                            <span className="text-amber-600">Pending Approval</span>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <CalendarIcon size={16} className="mr-2 text-gray-500" />
                                        <span className="font-medium mr-2">Joined:</span>
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllUsers;