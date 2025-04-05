import { Table } from "antd";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const MembersTable = ({ members }) => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(7); // Track page size in component state
  
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
      title: 'Total Meals',
      dataIndex: 'totalMealsHad',
      key: 'totalMealsHad',
    },
    {
      title: 'Current Month',
      dataIndex: 'currentMonth',
      key: 'currentMonth',
    },
    {
      title: 'Total Due',
      dataIndex: 'due',
      key: 'due',
    },
  ];

  // Configure the pagination options with change handler
  const paginationConfig = {
    pageSize: pageSize,
    showSizeChanger: true,
    pageSizeOptions: ['5', '7', '10', '20'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    position: ['bottomCenter'],
    onShowSizeChange: (current, size) => {
      setPageSize(size);
    },
    onChange: (page, pageSize) => {
      setPageSize(pageSize);
    }
  };

  return (
    <div className='w-full overflow-auto'>
      <Table 
        columns={columns} 
        dataSource={members}
        pagination={paginationConfig}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/layout/admin/memberDetails/${record.mobileNumber}`); // Redirecting to details page with ID
          },
          style: { cursor: 'pointer' }
        })}
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
};

export default MembersTable;