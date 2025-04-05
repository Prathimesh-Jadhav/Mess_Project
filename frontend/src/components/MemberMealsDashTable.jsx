import { Table } from "antd";
import React, { useContext } from 'react';
import { MessContext } from "../GlobalContext/Context";

const MemberMealsDashTable = ({ memberMeals }) => {
  const { mealRate } = useContext(MessContext);

  // Sort on the date field (descending)
  const sortedData = memberMeals.sort((a, b) => new Date(b.date) - new Date(a.date));

  const data = sortedData.map((meal) => ({
    key: meal._id,
    date: meal.date,
    totalMealsHad: meal.totalMealsHad,
    mealsSkipped: meal.mealsSkipped,
    amount: meal.totalMealsHad * mealRate,
  }));

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Meals',
      dataIndex: 'totalMealsHad',
      key: 'totalMealsHad',
    },
    {
      title: 'Meals Skipped',
      dataIndex: 'mealsSkipped',
      key: 'mealsSkipped',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 7,
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default MemberMealsDashTable;
