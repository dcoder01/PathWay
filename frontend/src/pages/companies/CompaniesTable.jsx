import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Edit2, MoreHorizontal, Building, Calendar, Search, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllCompanies } from '@/store/companySlice';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';

const CompaniesTable = ({ searchInput }) => {
  const { allCompanies, loading, error } = useSelector(store => store.companySlice);
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (searchInput) {
      setFilterCompany(
        allCompanies.filter(company =>
          company.name.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else {
      setFilterCompany(allCompanies);
    }
  }, [allCompanies, searchInput]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  //company initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-800">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>Failed to load companies. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <Building className="mr-2 text-blue-600" />
          <h2 className="text-lg font-medium">All Companies</h2>
        </div>
        <Badge variant="outline" className="text-amber-500 px-2.5 py-0.5">
          {filterCompany?.length || 0} {filterCompany?.length === 1 ? 'Company' : 'Companies'}
        </Badge>
      </div>

      {filterCompany?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          {searchInput ? (
            <>
              <Search className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-center">No companies found matching "<span className="font-medium">{searchInput}</span>"</p>
            </>
          ) : (
            <>
              <Building className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-center">No companies registered yet</p>
            </>
          )}
        </div>
      )}

      {filterCompany?.length > 0 && (
        <Table>
          <TableCaption>Complete list of registered companies</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right w-20">Recruiter</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterCompany.map((company) => (
              <TableRow key={company._id} className="hover:bg-blue-50 transition-colors cursor-default">
                <TableCell>
                  <Avatar className="border">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                      {getInitials(company.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {formatDate(company.createdAt)}
                </TableCell>
                {/* <TableCell className="text-right"> */}
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1.5">
                      <button 
                        onClick={() => navigate(`/admin/allCompanies/${company._id}`)} 
                        className="flex items-center gap-2 w-full p-2 text-left text-sm rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                        <span>Edit Company</span>
                      </button>
                    </PopoverContent>
                  </Popover> */}

                {/* </TableCell> */}
                <TableCell className="text-right">{company.createdBy.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CompaniesTable;