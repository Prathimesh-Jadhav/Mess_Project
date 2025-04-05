import React, { useEffect } from 'react'
import { GoSearch } from "react-icons/go";

const SearchButton = ({ dashboardMemberDetails, setSearchedData }) => {
    const [searchValue, setSearchValue] = React.useState('');

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        filterData();
    }, [searchValue]);

    const filterData = () => {
        const filteredData = dashboardMemberDetails.filter((item) => 
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.mobileNumber.includes(searchValue) // Ensuring it works for numeric search
        );
        setSearchedData(filteredData);
    }; 

    return (
        <div className='min-w-[240px] max-w-[240px] min-h-[40px] rounded-md border-[1px] border-gray-300 flex  overflow-hidden'>
            <div className='min-w-[82%]'>
                <input 
                    type="text" 
                    onChange={handleSearch} 
                    value={searchValue} 
                    className='outline-none w-full h-full p-2' 
                    placeholder='Search here' 
                />
            </div>
            <div className='min-w-[18%] max-w-[18%] bg-primary min-h-full hover:bg-primaryhover flex justify-center items-center hover:cursor-pointer'>
                <GoSearch size={18} color='#696969'/>
            </div>
        </div>
    );
};

export default SearchButton;