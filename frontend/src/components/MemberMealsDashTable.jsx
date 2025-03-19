import { Table } from "antd";
import React from 'react'

const MemberMealsDashTable = () => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Meals',
      dataIndex: 'meals',
      key: 'meals',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  const data = [
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

  return (
    <div className='w-full overflow-auto'>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default MemberMealsDashTable;