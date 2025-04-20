import React from 'react'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'

const WaitingForApproval = () => {
    const dispatch = useDispatch()
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Account Pending Approval</h2>
                <p className="text-gray-600 mb-6">
                    Your account has been created successfully.
                    Waiting for TPO's approval.
                    You will be given access shortly :)
                </p>

                <Button
                    onClick={() => (
                        dispatch(logout())
                    )}
                    className="hover:bg-gray-600 cursor-pointer"
                >
                    Return to Login
                </Button>
            </div>
        </div>
    )
}

export default WaitingForApproval