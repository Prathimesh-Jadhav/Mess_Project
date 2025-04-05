import { Table } from "antd";
import React from 'react';

const RecentDashMeals = ({ mealDetails }) => {
  const sortedData = mealDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
  const memberMeals = sortedData.slice(0, 5); // Keep top 5 meals if needed

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
      title: 'Last Meal Added At',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table 
        columns={columns} 
        dataSource={memberMeals} 
        pagination={{
          pageSize: 7,
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        rowKey={(record) => record.mobileNumber + record.date}
      />
    </div>
  );
};

export default RecentDashMeals;

