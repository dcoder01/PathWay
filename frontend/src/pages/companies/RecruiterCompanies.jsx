import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import { fetchRecruiterCompany } from '@/store/companySlice';

import SearchBar from '@/components/shared/SearchBar';
import { AlertCircle, ExternalLink, MapPin, Edit } from 'lucide-react';
import Header from '@/components/shared/Header';

const RecruiterCompanies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authSlice);
    const { recruiterCompany, loading, error } = useSelector((state) => state.companySlice);
    const [input, setInput] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState([]);
 
    
    useEffect(() => {
        if (user && user.role !== 'recruiter') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        dispatch(fetchRecruiterCompany());
    }, [dispatch]);

    useEffect(() => {
        if (input) {
            setFilteredCompanies(
                recruiterCompany.filter(company =>
                    company.name.toLowerCase().includes(input.toLowerCase())
                )
            );
        } else {
            setFilteredCompanies(recruiterCompany);
        }
    }, [recruiterCompany, input]);
    
    
    const handleEditCompany = (companyId) => {
       //dialog
    };

    if (loading) return <div className="text-center py-10">Loading company...</div>;
    if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

    return (
        <div className="mt-16">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">My Companies</h1>
                    <Button 
                        onClick={() => navigate('/add-company')}
                        className= "cursor-pointer hover:bg-gray-600"
                    >
                        Add New Company
                    </Button>
                </div>

                <div className="mb-6">
                    <SearchBar 
                        text="Search company by name" 
                        value={input} 
                        settingInput={setInput}
                    />
                </div>

                {filteredCompanies.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No company found</h3>
                        <p className="mt-2 text-gray-500">You haven't added any company yet or none match your search.</p>
                        
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredCompanies.map((company) => (
                            <div key={company._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center">
                                            <Avatar className="h-16 w-16 mr-4">
                                                <AvatarImage 
                                                    src={company.logo} 
                                                    alt={company.name} 
                                                />
                                            </Avatar>
                                            <div>
                                                <h2 className="text-xl font-semibold">{company.name}</h2>
                                                <p className="text-gray-500 text-sm">
                                                    Created on {new Date(company.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleEditCompany(company._id)}
                                            className="cursor-pointer flex items-center"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    </div>

                                    <div className="mt-4">
                                        {company.description && (
                                            <p className="text-gray-700 mb-3">{company.description}</p>
                                        )}
                                        
                                        {company.location && company.location.length > 0 && (
                                            <div className="flex items-center text-gray-600 text-sm mb-2">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{company.location.join(', ')}</span>
                                            </div>
                                        )}
                                        
                                        {company.website && (
                                            <div className="flex items-center text-blue-600 text-sm">
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                <a 
                                                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {company.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterCompanies;