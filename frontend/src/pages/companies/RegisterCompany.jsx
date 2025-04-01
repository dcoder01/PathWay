import Header from '@/components/shared/Header';
import { registerCompany } from '@/store/companySlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterCompany = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.companySlice);
    const [companyName, setCompanyName] = useState('ABC ltd.');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerCompany({ name: companyName })).then((data) => {
            if (data?.payload?.success) {
                toast.success(`Registered company name "${companyName}" successfully`);
                navigate("/");
            } else {
                toast.error(data?.payload || "Failed to register. Please try again.");
            }
        });
    };

    return (
        <div className="mt-18">
            <Header />
            <div className="max-w-lg mx-auto py-12 px-6">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Register a Company</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Fill in the details to register your company
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                                    placeholder="Enter your company name"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : 'Register Company'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                            <p className="text-sm font-medium">Error: {error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;