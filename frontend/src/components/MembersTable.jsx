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
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Place',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Accomodation',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'College',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
      Accomodation: '10 Downing Street',
      College: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      Accomodation: '10 Downing Street',
      College: '10 Downing Street',
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
