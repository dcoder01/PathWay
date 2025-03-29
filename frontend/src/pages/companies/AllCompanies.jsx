import React, { useEffect, useState } from 'react'
import { Input } from '../../components/ui/input'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/shared/Header'
import CompaniesTable from '@/components/companies/CompaniesTable'
import { Search } from 'lucide-react'


const AllCompanies = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
   

 
    return (
        <div className='mt-18'>
            <Header />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                <div className="relative w-fit">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <Input
                            className="pl-10 w-64" 
                            placeholder="Filter by name"
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>
                <CompaniesTable
                    searchInput={input}
                />
            </div>
        </div>
    )
}

export default AllCompanies