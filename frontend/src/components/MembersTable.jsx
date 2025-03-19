import { Table } from "antd";
import React from 'react'
import { useNavigate } from "react-router-dom";

const MembersTable = () => {

  const [status, setStatus] = React.useState('not active')
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Place',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Accomodation',
      dataIndex: 'accommodation',
      key: 'accommodation',
    },
    {
      title: 'College',
      dataIndex: 'college',
      key: 'college',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Rahul Sharma',
      mobile: '9876543210',
      place: 'Pune',
      accommodation: 'Hostel',
      college: 'MIT Pune',
    },
    {
      key: '2',
      name: 'Sneha Patil',
      mobile: '9123456789',
      place: 'Mumbai',
      accommodation: 'PG',
      college: 'IIT Bombay',
    },
    {
      key: '3',
      name: 'Amit Verma',
      mobile: '9988776655',
      place: 'Bangalore',
      accommodation: 'Rented Apartment',
      college: 'RV College of Engineering',
    },
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table columns={columns} dataSource={data}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/layout/admin/memberDetails/${record.key}`); // Redirecting to details page with ID
          },
        })}
      />
    </div>
  )
}

export default MembersTable
