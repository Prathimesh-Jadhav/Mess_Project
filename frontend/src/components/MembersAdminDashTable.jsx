import React from "react";
import { Table } from "antd";

const MembersAdminDashTable = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name", // Fixed: Lowercase for consistency
      key: "name",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber", // Fixed: Matching data key
      key: "mobileNumber",
    },
    {
      title: "Place",
      dataIndex: "place", // Fixed: Lowercase for consistency
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
  ];

  const data = [
    {
      key: "1",
      name: "Mike",
      mobileNumber: "9876543210", // Fixed: Matching dataIndex
      place: "10 Downing Street",
      accommodation: "10 Downing Street",
      college: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      mobileNumber: "8765432109",
      place: "10 Downing Street",
      accommodation: "10 Downing Street",
      college: "10 Downing Street",
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default MembersAdminDashTable;
