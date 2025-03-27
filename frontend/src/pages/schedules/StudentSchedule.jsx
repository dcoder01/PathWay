import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Loader2, AlertCircle, Calendar, Clock, MapPin } from "lucide-react"
import { fetchAllSchedules } from "@/store/scheduleSlice"
import Header from "@/components/shared/Header"

const StudentSchedule = () => {
    const dispatch = useDispatch()
    const { studentSchedules, loading, error } = useSelector((state) => state.scheduleSlice)

    useEffect(() => {
        dispatch(fetchAllSchedules())
    }, [dispatch])

    const ScheduleCard = ({ schedule }) => {
        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        }

        return (
            <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 bg-white">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                                {schedule.job?.title || "Unknown Job"}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                {schedule.job?.company?.name || "No Company"}
                            </p>
                        </div>
                        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            {schedule.type || "Interview"}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="h-5 w-5 mr-3 text-purple-600" />
                            <span className="font-medium">{formatDate(schedule.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Clock className="h-5 w-5 mr-3 text-green-600" />
                            <span className="font-medium">{schedule.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPin className="h-5 w-5 mr-3 text-red-600" />
                            <span className="font-medium">{schedule.location}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-6xl mx-auto py-12 mt-16 px-4 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Schedules</h1>
                    <p className="text-gray-600">Upcoming interviews and events</p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-gray-800" size={48} />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                        <AlertCircle className="mr-3 text-red-600" size={24} />
                        <span className="text-red-800">{error}</span>
                    </div>
                )}

                {!loading && studentSchedules?.length === 0 && (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <p className="text-gray-600 mb-4">No upcoming schedules</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentSchedules?.map((schedule) => (
                        <ScheduleCard key={schedule._id} schedule={schedule} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudentSchedule