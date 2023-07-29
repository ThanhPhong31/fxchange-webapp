import { NextPageWithLayout } from '../_app'
import { useAuth } from '@/contexts/auth-context'
import { GetHistoryPoint } from '@/graphql/queries/user-query'
import { useLazyQuery } from '@apollo/client'
import { DatePicker, Select, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

type PointHistory = {
  id: string
  change: number
  content: string
  time: Date | string
}

type DataType = {
  id: string
  change: number
  content: string
  time: Date | string
}

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const PointsHistory: NextPageWithLayout = () => {
  const { user } = useAuth()
  const { RangePicker } = DatePicker
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  })
  const [datesOfChart, setDatesOfChart] = useState(1)
  const [historyPoints, setHistoryPoints] = useState<PointHistory[]>([])
  const [searchedHistoryPoints, setSearchedHistoryPoints] = useState<PointHistory[]>([])
  const [
    getPointHistory,
    { data: pointHistoryData, loading: pointHistoryLoading, error: pointHistoryError },
  ] = useLazyQuery<{ pointHistory: PointHistory[] }>(GetHistoryPoint)

  useEffect(() => {
    if (user) {
      getPointHistory({
        variables: {
          userId: user?.uid,
        },
      })
    }
  }, [getPointHistory, user])

  useEffect(() => {
    if (pointHistoryData) {
      const historyListRaw = pointHistoryData.pointHistory
      let modHistoryList: PointHistory[] = []
      historyListRaw.forEach((historyDetailRaw, index) => {
        let historyDetail: PointHistory = {
          id: historyDetailRaw.id,
          content: historyDetailRaw.content,
          time: moment(historyDetailRaw?.time).format('YYYY-MM-DD HH:MM'),
          change: historyDetailRaw?.change,
        }
        if (index === 0) {
          historyDetail.change = historyDetailRaw.change
        } else {
          historyDetail.change = historyDetailRaw.change - historyListRaw[index - 1].change
        }
        modHistoryList.push(historyDetail)
      })

      setHistoryPoints(modHistoryList)
      setSearchedHistoryPoints(modHistoryList.reverse())
    }
  }, [pointHistoryData])

  useEffect(() => {
    if (historyPoints && pointHistoryData) {
      const historyPointsClone = [...historyPoints]
      let pointHistoryClone = [...pointHistoryData.pointHistory]
      console.log(pointHistoryClone)
      const time1 = new Date(moment(historyPointsClone[0]?.time).format('YYYY-MM-DD'))
      let newChartDatas: PointHistory[] = []

      newChartDatas.push(historyPointsClone[0])
      for (let i = 1; i < historyPointsClone.length; i++) {
        const time2 = new Date(moment(historyPointsClone[i]?.time).format('YYYY-MM-DD'))
        if (!time2) return
        const time = (time1.getTime() - time2.getTime()) / 1000 / 60 / 60 / 24

        if (time < datesOfChart) {
          newChartDatas.push(historyPointsClone[i])
        } else {
          break
        }
      }
    
      setChartData({
        labels: newChartDatas
          .reverse()
          .map((item) => moment(item?.time).format('YYYY-MM-DD HH:MM')),
        datasets: [
          {
            label: 'FPoints',
            data: pointHistoryClone.reverse().map((item) => item.change),
            fill: false,
            borderColor: 'rgb(0, 96, 128)',
            backgroundColor: 'rgba(0, 96, 128, 0.3)',
            borderWidth: 2,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            borderSkipped: 'bottom',
          },
        ],
      })
    }
  }, [historyPoints, datesOfChart])

  const renderChangeCell = (value: number) => {
    const cellStyle = {
      color: value > 0 ? '#00cc00' : 'red',
    }

    return (
      <span style={cellStyle}>
        {value > 0 ? '+' : ''}
        {value}
      </span>
    )
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nội dung chi tiết',
      dataIndex: 'content',
      width: '50%',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: '30%',
      sorter: {
        compare: (a, b) => moment(a.time).valueOf() - moment(b.time).valueOf(),
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'change',
      width: '20%',
      render: renderChangeCell,
    },
  ]

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (historyPoints.length > 0) {
      if (dates) {
        let searchedItem = historyPoints.filter((item) => {
          if (
            (item.time.toString() >= dateStrings[0].toString() &&
              item.time.toString() <= dateStrings[1].toString()) ||
            (moment(item.time).format('YYYY-MM-DD') ===
              moment(dateStrings[0]).format('YYYY-MM-DD') &&
              moment(item.time).format('YYYY-MM-DD') ===
                moment(dateStrings[1]).format('YYYY-MM-DD'))
          )
            return true
        })
        setSearchedHistoryPoints(searchedItem)
      } else {
        setSearchedHistoryPoints(historyPoints)
      }
    }
  }

  const handleChange = (value: number) => {
    setDatesOfChart(value)
  }

  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  ]

  return (
    <div>
      <h3 className="text-3xl max-md:text-xl">Ví FPoints</h3>
      <div className="mt-6 p-8 border rounded-2xl">
        <div className="relative">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: true,
                  ticks: {
                    callback: (value, index, values) => {
                      if (index === values.length - 1) {
                        return moment(chartData.labels[index]).format('DD/MM')
                      } else if (
                        chartData.labels[index].slice(0, 10) !==
                        chartData.labels[index + 1].slice(0, 10)
                      ) {
                        return moment(chartData.labels[index]).format('DD/MM')
                      }
                    },
                  },
                },
              },
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'BIỂU ĐỒ ĐIỂM', position: 'top' },
              },
            }}
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="absolute -top-2 right-2">
            <Select
              defaultValue={1}
              style={{ width: 90 }}
              onChange={handleChange}
              options={[
                { value: 1, label: '1 ngày' },
                { value: 3, label: '3 ngày' },
                { value: 7, label: '7 ngày' },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 p-8 border rounded-2xl">
        <div className="ml-2 flex items-center">
          <div className="mr-2">
            <label htmlFor="">Tìm kiếm:</label>
          </div>
          <RangePicker
            id="dateReach"
            presets={rangePresets}
            onChange={onRangeChange}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </div>
        <div className="my-4">
          <hr />
        </div>
        <Table
          columns={columns}
          dataSource={searchedHistoryPoints}
          rowKey="id"
          // onChange={onChange}
        />
      </div>
    </div>
  )
}

export default PointsHistory
