import React from 'react'

const KeyStats = ({heading, value, Logo,tag}) => {
    return (
        <div className='sm:min-w-[350px] max-w-[400px] min-h-[130px] bg-white rounded-md border-[1px] p-5 font-poppins max-sm:w-full'>
            <div className='flex justify-between items-center'>
                <p className=' text-bodyText'>{heading}</p>
                <div>{Logo && <Logo size={18} color='#333333'/>}</div>
            </div> 
            <div className='mt-2'>
                <div className={`text-subheading font-semibold ${value=='Active'&&'text-green-600'}`}>{value}</div>
                <div className='text-smallText text-gray-500'>{tag}</div>
            </div>
        </div>
    )
}

export default KeyStats
