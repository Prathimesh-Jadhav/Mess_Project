import React from 'react'
import { Table, Tag, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

const PaymentsTable = ({ payments, isPreviousPayments }) => {
  const getStatusTag = (status) => {
    if (status === 'completed') {
      return <Tag color="green">Completed</Tag>
    } else if (status === 'pending') {
      return <Tag color="orange">Pending</Tag>
    } else if (status === 'overdue') {
      return <Tag color="red">Overdue</Tag>
    } else {
      return <Tag color="blue">{status}</Tag>
    }
  }

  const columns = [
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Amount To Pay',
      dataIndex: 'amountToPay',
      key: 'amountToPay',
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
    },
  ]

  // Add additional columns based on whether it's previous or due payments
  if (isPreviousPayments) {

  } else {
    columns.push({
      title: 'Due Amount',
      dataIndex: 'Due',
      key: 'Due',
    },
)
  }


  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={payments} 
        rowKey="invoiceId"
        pagination={{ pageSize: 6 }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'No payment records found' }}
      />
    </div>
  )
}

export default PaymentsTable