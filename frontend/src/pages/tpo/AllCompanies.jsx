import React, { useEffect, useState } from 'react'
import { Input } from '../../components/ui/input'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/shared/Header'
import CompaniesTable from '@/pages/companies/CompaniesTable'
import { Search } from 'lucide-react'
import SearchBar from '@/components/shared/SearchBar'


const AllCompanies = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();



    return (
        <div className='mt-18'>
            <Header />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between my-5'>
                    <SearchBar
                        input={input}
                        settingInput={setInput}
                        text="filter by company name"
                    />
                </div>
                <CompaniesTable
                    searchInput={input}
                />
            </div>
        </div>
    )
}

export default AllCompanies