import { useState, useMemo } from 'react';
import { Table, Input, Select, Space } from 'antd';
import { ColumnsType, PaginationProps } from 'antd/es/table';
import { SorterResult, SortOrder } from 'antd/es/table/interface';
import './App.css';
import { useQuery } from 'react-query';
import { ITodo } from './types';
import { createFetch } from './utils';
import { API_URL } from './constants';

function App() {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ITodo>>({});
  const [selectOrderValue, setSelectOrderValue] = useState<string | null>(null);
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const [titleFilter, setTitleFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useQuery('users', createFetch<ITodo[]>(`${API_URL}todos`));

  const preparedDataSource: ITodo[] = useMemo(() => {
    let dataSource: ITodo[] = data || [];
    if (completedFilter !== null) {
      dataSource = dataSource.filter(
        ({ completed }) => completed === completedFilter,
      );
    }
    if (titleFilter !== null) {
      dataSource = dataSource.filter(({ title }) => {
        const formatterSearchText = title.toLowerCase();
        const formatterInputText = titleFilter.toLowerCase();
        return formatterSearchText.includes(formatterInputText);
      });
    }

    return dataSource;
  }, [data, completedFilter, titleFilter]);

  const columns: ColumnsType<ITodo> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'user',
      dataIndex: 'userId',
      key: 'userId',
      width: 50,
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      sortOrder: sortedInfo.columnKey === 'title' ? sortedInfo.order : null,
      sorter: (a, b) => a.title.length - b.title.length,
      //   if (a.title > b.title) {
      //     return 1;
      //   }
      //   if (a.title < b.title) {
      //     return -1;
      //   }
      //   return 0;
      // },
    },
    {
      title: 'completed',
      dataIndex: 'completed',
      key: 'completed',
      render: (data) => (data ? 'true' : 'false'),
      onFilter: (e) => {
        console.log('onFilter', e);
        return true;
      },
      width: 50,
    },
  ];

  const selectOptions: { value: SortOrder; label: string }[] = [
    {
      value: 'ascend',
      label: 'ascend',
    },
    {
      value: 'descend',
      label: 'descend',
    },
  ];

  const resetPage = () => {
    setCurrentPage(1);
  };

  return (
    <div style={{ width: 800 }}>
      <Space style={{ display: 'flex', flexDirection: 'column' }}>
        <Space size={50} style={{ display: 'flex' }}>
          <Space direction="vertical">
            <div style={{ textAlign: 'left', paddingLeft: 5 }}>Input text:</div>
            <Input
              placeholder="Search..."
              style={{ width: 300 }}
              value={titleFilter || ''}
              onChange={(e) => {
                setTitleFilter(e.target.value ?? null);
                resetPage();
              }}
            />
          </Space>
          <Space direction="vertical">
            <div style={{ textAlign: 'left', paddingLeft: 5 }}>Completed:</div>
            <Select
              style={{ width: 300 }}
              allowClear
              placeholder="Completed value"
              options={[
                {
                  value: true,
                  label: 'true',
                },
                {
                  value: false,
                  label: 'false',
                },
              ]}
              onChange={(e) => {
                //  console.log('Completed value', e);
                setCompletedFilter(e ?? null);
                resetPage();
              }}
            />
          </Space>
        </Space>
        <Space size={50} style={{ display: 'flex', paddingBottom: 20 }}>
          <Space direction="vertical">
            <div style={{ textAlign: 'left', paddingLeft: 5 }}>Sort By:</div>
            <Select
              style={{ width: 300 }}
              placeholder="Sort by"
              options={[
                {
                  value: 'id',
                  label: 'id',
                },
                {
                  value: 'title',
                  label: 'title',
                },
              ]}
              allowClear
              onChange={(e) => {
                setSelectOrderValue(e);

                resetPage();
              }}
            />
          </Space>
          <Space direction="vertical">
            <div style={{ textAlign: 'left', paddingLeft: 5 }}>Order:</div>
            <Select
              style={{ width: 300 }}
              placeholder="Order"
              allowClear
              options={selectOptions}
              onChange={(e) => {
                if (e && selectOrderValue) {
                  setSortedInfo({
                    columnKey: selectOrderValue,
                    order: e,
                  });
                }
                resetPage();
              }}
            />
          </Space>
        </Space>
      </Space>
      <Table
        columns={columns}
        rowKey={'id'}
        dataSource={preparedDataSource}
        pagination={{
          current: currentPage,
          defaultPageSize: 15,
          pageSizeOptions: [15, 30, 50, 100],
        }}
        onChange={(pagination, filters, sorter, extra) => {
          console.log('pagination', pagination);
          console.log('filters', filters);
          console.log('sorter', sorter);
          console.log('extra', extra);
          if (extra.action === 'sort') {
            // setSortedInfo(sorter as SorterResult<ITodo>);
            setSortedInfo({
              ...sorter,
              order: sortedInfo.order,
            } as SorterResult<ITodo>);
          }
          if (extra.action === 'paginate') {
            setCurrentPage(pagination.current as PaginationProps);
          }
        }}
      />
    </div>
  );
}

export default App;
