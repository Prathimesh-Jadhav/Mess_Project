import { Table, Button, Popconfirm, Space, message } from "antd";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import {toast} from 'react-toastify'

const MembersTable = ({ members,fetchMemberDashDetails }) => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(7);

  const handleDelete = async (mobileNumber) => {
    console.log(mobileNumber)
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/members/deleteMember/${mobileNumber}`);
      if (res.data.success) {
      toast.success('Member deleted successfully');
      fetchMemberDashDetails(); // Refresh list
      } else {
        toast.error(res.data.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting member');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
    {
      title: 'Total Meals (Current Month)',
      dataIndex: 'totalMealsHad',
      key: 'totalMealsHad',
    },
    {
      title: 'Total Due',
      dataIndex: 'due',
      key: 'due',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/layout/admin/memberDetails/${record.mobileNumber}`);
            }}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this member?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record.mobileNumber);
            }}
            onCancel={(e) => e.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const paginationConfig = {
    pageSize,
    showSizeChanger: true,
    pageSizeOptions: ['5', '7', '10', '20'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    position: ['bottomCenter'],
    onShowSizeChange: (current, size) => setPageSize(size),
    onChange: (page, size) => setPageSize(size),
  };

  return (
    <div className='w-full overflow-auto'>
      <Table
        columns={columns}
        dataSource={members}
        pagination={paginationConfig}
        onRow={(record) => ({
          onClick: () => navigate(`/layout/admin/memberDetails/${record.mobileNumber}`),
          style: { cursor: 'pointer' }
        })}
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
};

export default MembersTable;
