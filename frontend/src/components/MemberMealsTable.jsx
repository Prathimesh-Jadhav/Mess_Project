import { Table } from "antd";
import React, { useContext } from 'react';
import { MessContext } from "../GlobalContext/Context";

const MemberMealsTable = ({ userMealDetails }) => {
  const { mealRate } = useContext(MessContext);

  // Sort on the date field
  const sortedData = userMealDetails.sort((a, b) => new Date(b.date) - new Date(a.date));

  const data = sortedData.map((meal) => {
    return {
      key: meal._id,
      date: meal.date,
      totalMealsHad: meal.totalMealsHad,
      mealsSkipped: meal.mealsSkipped,
      amount: meal.totalMealsHad * mealRate,
    };
  });

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
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table
        columns={columns}
        dataSource={data}
        pagination={data.length > 7 ? { pageSize: 7 } : false} 
      />
    </div>
  );
};

export default MemberMealsTable;
