import { Table } from "antd";
import React from "react";

const MemberMealsTable = () => {
  const [status, setStatus] = React.useState("not active");

  const columns = [
    {
      title: "Name",
      dataIndex: "name", // Fixed: Changed to lowercase to match data keys
      key: "name",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber", // Fixed: Removed space
      key: "mobileNumber",
    },
    {
      title: "Place",
      dataIndex: "place",
      key: "place",
    },
    {
      title: "Accommodation",
      dataIndex: "accommodation", // Fixed: Correct spelling
      key: "accommodation",
    },
    {
      title: "College",
      dataIndex: "college",
      key: "college",
    },
    {
      title: "Meals",
      dataIndex: "meals",
      key: "meals",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Mike",
      mobileNumber: "9876543210", // Fixed: Added missing mobileNumber field
      place: "New York",
      accommodation: "Hostel A",
      college: "XYZ University",
      meals: 2,
      amount: 200,
    },
    {
      key: "2",
      name: "John",
      mobileNumber: "8765432109",
      place: "Los Angeles",
      accommodation: "Hostel B",
      college: "ABC University",
      meals: 3,
      amount: 300,
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default MemberMealsTable;
