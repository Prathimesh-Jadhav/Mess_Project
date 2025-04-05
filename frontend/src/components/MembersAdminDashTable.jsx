import { Table } from "antd";
import React from 'react';

const MembersAdminDashTable = ({ dashboardMemberDetails }) => {

  // Sort in descending order of remaining amount (due)
  const sortedData = dashboardMemberDetails.sort((a, b) => b.due - a.due);

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
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
    },
    {
      title: 'Remaining Amount',
      dataIndex: 'due',
      key: 'due',
    },
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table
        columns={columns}
        dataSource={sortedData}
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        rowKey={(record) => record.mobileNumber}
      />
    </div>
  );
};

export default MembersAdminDashTable;

