import { Button, List } from 'antd';

import { Stuff } from '@/types/model';

import StuffRowData from './stuff-rowdata';

export interface StuffTableProps {
  dataSource: Stuff[]
  initLoading: boolean
  loading: boolean
  onLoadMore: () => void
}

const StuffTable = ({ dataSource, initLoading, loading, onLoadMore }: StuffTableProps) => {
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>Tải thêm</Button>
      </div>
    ) : null

  return (
    <List
      loading={loading}
      loadMore={loadMore}
      dataSource={dataSource}
      renderItem={(item) => <StuffRowData data={item} />}
    />
  )
}
// (render_list', () => {
//   const dataSource = [];
//   const initLoading = false;
//   const loading = false;
//   const onLoadMore = jest.fn();

//   const wrapper = shallow(<StuffTable dataSource={dataSource} initLoading={initLoading} loading={loading} onLoadMore={onLoadMore} />);

//   expect(wrapper.find(List).props()).toEqual({
//       loading: loading,
//       loadMore: null,
//       dataSource: dataSource,
//       renderItem: expect.any(Function)
//   });
// });
export default StuffTable
