import React from 'react'
// import { Table } from '@radix-ui/themes/dist/cjs/index.js'
import { Table } from "antd";

const MembersAdminDashTable = () => {

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
            {/* <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Mobile Number</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Place</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Accomodation</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>College</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                        <Table.Cell>danilo@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
                        <Table.Cell>zahra@example.com</Table.Cell>
                        <Table.Cell>Admin</Table.Cell>
                        <Table.Cell>Admin</Table.Cell>
                        <Table.Cell>Admin</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
                        <Table.Cell>jasper@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root> */}

            <Table columns={columns} dataSource={data} />

        </div>
    )
}

export default MembersAdminDashTable
