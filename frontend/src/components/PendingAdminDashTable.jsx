import React from 'react'
import { Table } from "antd";

const PendingAdminDashTable = () => {

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
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}

export default PendingAdminDashTable
