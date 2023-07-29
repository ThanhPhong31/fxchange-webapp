import { Button, List } from 'antd';

import { Auction, Stuff } from '@/types/model';

import AuctionRowData from './auction-rowdata';
import StuffRowData from './stuff-rowdata';

export interface AuctionTableProps {
  dataSource: Auction[]
  initLoading: boolean
  loading: boolean
  onLoadMore: () => void
}

const AuctionTable = ({ dataSource, initLoading, loading, onLoadMore }: AuctionTableProps) => {
  const loadMore =
    !initLoading && !loading && dataSource.length > 10 ? (
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
      renderItem={(item) => <AuctionRowData data={item} />}
    />
  )
}

export default AuctionTable
