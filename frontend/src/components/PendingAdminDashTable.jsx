import { Table } from "antd";
import React from 'react';

const PendingAdminDashTable = ({ memberDueDetails }) => {
  // Filter members who have pending dues
  const membersDue = memberDueDetails.filter((member) => member.due !== 0);

  // Sort in descending order by date
  const sortedData = membersDue.sort((a, b) => new Date(b.date) - new Date(a.date));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
    {
      title: 'Permanent Address',
      dataIndex: 'permanentAddress',
      key: 'permanentAddress',
    },
    {
      title: 'Hostel Address',
      dataIndex: 'hostelAddress',
      key: 'hostelAddress',
    },
    {
      title: 'College',
      dataIndex: 'college',
      key: 'college',
    },
    {
      title: 'Pending Amount',
      dataIndex: 'due',
      key: 'due',
    },
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table 
        columns={columns} 
        dataSource={sortedData} 
        pagination={{ pageSize: 7 }} 
      />
    </div>
  );
};

export default PendingAdminDashTable;
