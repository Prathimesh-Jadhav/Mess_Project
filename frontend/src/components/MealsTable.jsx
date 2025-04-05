import { Table } from "antd";
import React from 'react';

const MealsTable = ({ meals }) => {

  //sort the meals on basis of date
  const sortedData = meals.sort((a, b) => new Date(b.date) - new Date(a.date));
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
      render: (text) => {
        // Format date if needed
        return text;
      }
    }
  ];

  // Sample data - this will be replaced by the actual meals data passed as props
  const sampleData = [
    {
      key: '1',
      date: '2025-03-18',
      meals: 2,
      amount: 200,
    },
    {
      key: '2',
      date: '2025-03-17',
      meals: 3,
      amount: 300,
    },
    {
      key: '3',
      date: '2025-03-16',
      meals: 1,
      amount: 100,
    },
  ];

  // Use the actual meals data if available, otherwise use sample data
  const tableData = sortedData && sortedData.length > 0 ? sortedData : sampleData;

  // Configure pagination
  const paginationConfig = {
    pageSize: 7,
    hideOnSinglePage: true, // Hide pagination if there's only one page
    showSizeChanger: false, // Optional: disable the page size selector
  };

  return (
    <div className='w-full overflow-auto'>
      <Table 
        columns={columns} 
        dataSource={tableData} 
        pagination={paginationConfig}
        rowKey={(record) => record.key || record.id || Math.random().toString(36).substr(2, 9)}
      />
    </div>
  );
};

export default MealsTable;
