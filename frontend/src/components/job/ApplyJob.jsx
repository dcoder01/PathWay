import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../../components/ui/button'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { applyJob } from '@/store/jobSlice'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'


const ResumeUpload = () => {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const dispatch = useDispatch()
    const params = useParams()
    const { jobId } = params
    const navigate=useNavigate()


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]


        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            const maxSize = 5 * 1024 * 1024 //file compares in bytes

            if (!allowedTypes.includes(selectedFile.type)) {
                alert('Please upload a PDF or Word document')
                return
            }

            if (selectedFile.size > maxSize) {
                alert('File size should be less than 5MB')
                return
            }

            setFile(selectedFile)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first')
            return
        }
        setUploading(true);
        const formData = new FormData()
        formData.append('file', file)

        //dispatch
        dispatch(applyJob({ jobId, formData })).then((data) => {


            if (data?.payload?.success) {
                toast.success("Applied for the job successfully!");
                navigate("/jobs");
            } else {
                toast.error(data?.payload || "Failed to apply! Try again.");
                setUploading(false);
            }
        });
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                <div className="text-center mb-6">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800">Upload Your Resume</h2>
                    <p className="text-gray-500 mt-2">PDF or DOCX (max 5MB)</p>
                </div>

                <div className="mb-4">
                    <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="block w-full p-4 border-2 border-dashed border-purple-200 rounded-lg text-center cursor-pointer hover:border-purple-400 transition"
                    >
                        {file ? (
                            <div className="flex items-center justify-center">
                                <FileText className="h-6 w-6 mr-2" />
                                <span className="text-gray-700">{file.name}</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center text-gray-500">
                                <Upload className="h-6 w-6 mr-2" />
                                <span>Select Resume File</span>
                            </div>
                        )}
                    </label>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full cursor-pointer mt-4 flex items-center justify-center"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            Apply
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default ResumeUpload