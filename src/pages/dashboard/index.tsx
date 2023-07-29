import { NextPageWithLayout } from '../_app'
import IsAdmin from '@/components/auth/is-admin'
import { getDashboardLayout } from '@/components/layouts/dashboard-layout'
import CenterContainer from '@/components/ui/common/center-container'
import {
  GET_AVERAGE_TRANSACTION,
  GET_CREATED_USERS,
  GET_POPULAR_CATEGORIES,
  GET_TOP_ACTIVE_USER,
  GET_TRANSACTION_BY_TYPE,
  GET_TRANSACTION_RATES,
} from '@/graphql/queries/dashboard-query'
import userQuery from '@/graphql/queries/user-query'
import { ArrowDownOutlined, LikeOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { Avatar, Card, Col, List, Select, Space, Spin, Statistic } from 'antd'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type User = {
  information: {
    full_name: string
    avatar_url: string
    email: string
  }
}

type PopularCategoriesResponse = {
  name: string
  slug: string
  amount: number[]
}

type TransactionsTypeByDate = {
  date: string
  data: {
    exchange: number
    market: number
    auction: number
  }
}

const DashboardRoot: NextPageWithLayout = () => {
  const [creUserCount, setCreUserCount] = useState(0)
  const [timeShowed, setTimeShowed] = useState<string>('week')
  const [avgTimeOfTrans, setAvgTimeOfTrans] = useState<string>('')
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [transTypes, setTransTypes] = useState<TransactionsTypeByDate[]>([])
  const [popularCategories, setPopularCategories] = useState<PopularCategoriesResponse[]>([])
  const [inputDates, setInputDates] = useState({
    start: new Date(),
    end: new Date(),
  })

  const {
    loading: loadingAvTrans,
    error: errorAvTrans,
    data: dataAvTrans,
  } = useQuery(GET_AVERAGE_TRANSACTION)
  const {
    loading: loadingTopUsers,
    error: errorTopUsers,
    data: dataTopUsers,
  } = useQuery(GET_TOP_ACTIVE_USER)
  const {
    loading: loadingTransactionRates,
    error: errorTransactionRates,
    data: dataTransactionRates,
  } = useQuery(GET_TRANSACTION_RATES, {
    variables: {
      start: inputDates.start,
      end: inputDates.end,
    },
  })
  const {
    loading: loadingTransactionByType,
    error: errorTransactionByType,
    data: dataTransactionByType,
  } = useQuery(GET_TRANSACTION_BY_TYPE, {
    variables: {
      start: inputDates.start,
      end: inputDates.end,
    },
  })
  const {
    loading: loadingCreUsers,
    error: errorCreUsers,
    data: dataCreUsers,
  } = useQuery(userQuery.findAll())
  const {
    loading: loadingPopularCategories,
    error: errorPopularCategories,
    data: dataPopularCategories,
  } = useQuery(GET_POPULAR_CATEGORIES)

  const formatter = new Intl.DateTimeFormat('en', {
    timeZone: 'UTC',
  })

  let getOneWeekAgo = () => {
    let oneWeekAgo = new Date()
    oneWeekAgo = new Date(Date.parse(formatter.format(oneWeekAgo)))
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return oneWeekAgo
  }

  let today = new Date()
  today = new Date(Date.parse(formatter.format(today)))
  today.setDate(today.getDate() + 1)
  let oneWeekAgo = getOneWeekAgo()

  useEffect(() => {
    setInputDates({
      start: oneWeekAgo,
      end: today,
    })
  }, [])

  useEffect(() => {
    if (dataTransactionByType) {
      setTransTypes(dataTransactionByType.transTypes)
    }
  }, [dataTransactionByType])

  useEffect(() => {
    if (dataAvTrans) {
      let newAvgTime = Math.floor(dataAvTrans.avgTimeOfTrans)
      let hourse = Math.floor(newAvgTime / 3600)
      let minutes = Math.floor((newAvgTime - hourse * 3600) / 60)
      let seconds = newAvgTime - hourse * 3600 - minutes * 60
      setAvgTimeOfTrans(hourse + ' giờ ' + minutes + ' phút ' + seconds + ' giây ')
    }
  }, [dataAvTrans])

  useEffect(() => {
    if (dataPopularCategories) {
      setPopularCategories(dataPopularCategories.popularCates)
    }
  }, [dataPopularCategories])

  useEffect(() => {
    if (dataTopUsers) {
      setTopUsers(dataTopUsers.topUsers)
      console.log(dataTopUsers.topUsers)
    }
  }, [dataTopUsers])

  useEffect(() => {
    if (dataCreUsers) {
      setCreUserCount(dataCreUsers.users.length)
    }
  }, [dataCreUsers])

  if (
    loadingAvTrans ||
    loadingTopUsers ||
    loadingPopularCategories ||
    loadingTransactionRates ||
    loadingTransactionByType ||
    loadingCreUsers
  )
    return (
      <Spin spinning>
        <CenterContainer fixed />
      </Spin>
    )

  const handleChange = (value: string) => {
    setTimeShowed(value)
  }

  //----------Categories-------------
  const radarChartData: { series: any; options: ApexOptions } = {
    series: [
      {
        name: 'Số lượng',
        data: popularCategories?.map((item, index) => item.amount),
      },
    ],
    options: {
      chart: {
        type: 'radar',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: 'Xu hướng danh mục',
      },
      xaxis: {
        categories: popularCategories?.map((item, index) => item.name),
      },
    },
  }
  //----------------------------

  const pieChartData = {
    series: [
      dataTransactionRates?.getTransactionRates.success,
      dataTransactionRates?.getTransactionRates.pending,
      dataTransactionRates?.getTransactionRates.cancel,
    ],
    options: {
      chart: {
        width: 380,
      },
      labels: ['Thành công', 'Đã hủy bỏ', 'Đang tiến hành'],
      colors: ['#00e396', '#ff4560', '#feb019'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      title: {
        text: 'Tỉ trọng trạng thái phiên giao dịch',
      },
    },
  }

  //----------Types-------------
  const dates = transTypes.map((item, index) => {
    if (!item.date) {
      return 0
    }
    return item.date
  })
  const dataY1 = transTypes.map((item, index) => {
    if (!item.data.exchange) {
      return 0
    }
    return item.data.exchange
  })
  const dataY2 = transTypes.map((item, index) => {
    if (!item.data.market) {
      return 0
    }
    return item.data.market
  })
  const dataY3 = transTypes.map((item, index) => {
    if (!item.data.auction) {
      return 0
    }
    return item.data.auction
  })

  const chartData = {
    series: [
      {
        name: 'Trao đổi',
        data: dataY1,
      },
      {
        name: 'Mua bán',
        data: dataY2,
      },
      {
        name: 'Đấu giá',
        data: dataY3,
      },
    ],
    options: {
      chart: {
        id: 'dashed-line-chart',
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: dates,
      },
      stroke: {
        dashArray: [0, 3, 0],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val: string) {
                return val
              },
            },
          },
          {
            title: {
              formatter: function (val: string) {
                return val
              },
            },
          },
          {
            title: {
              formatter: function (val: string) {
                return val
              },
            },
          },
        ],
      },
      title: {
        text: 'Giao dịch theo Loại',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
    },
  }
  //----------------------------

  return (
    <>
      <IsAdmin>
        <div>
          <div className="p-6 border rounded-lg">
            <div className="flex items-center justify-between px-4 text-2xl font-semibold">
              <div>DASHBOARD</div>
              {/* <div className="mb-1">
                <Select
                  defaultValue={timeShowed}
                  style={{ width: 90 }}
                  onChange={handleChange}
                  options={[{ value: 'week', label: 'Tuần' }]}
                />
              </div> */}
            </div>
            <div className="mt-2">
              <hr />
            </div>
            <div>
              <div className="flex justify-around p-4 mt-2">
                <div className="w-4/12">
                  <div className="p-3 mx-2">
                    <Col>
                      <Card bordered={true}>
                        <Statistic
                          title="Người dùng"
                          value={creUserCount}
                          valueStyle={{ marginLeft: 10 }}
                          prefix={<PeopleAltIcon className="text-[48px]" />}
                          suffix="Người dùng"
                        />
                      </Card>
                    </Col>
                  </div>

                  <div className="p-3 mx-2 mt-4">
                    <Col>
                      <Card bordered={true}>
                        <Statistic
                          title="Thời gian giao dịch trung bình"
                          value={avgTimeOfTrans}
                          valueStyle={{ marginLeft: 10 }}
                          prefix={<AvTimerIcon className="text-[48px]" />}
                        />
                      </Card>
                    </Col>
                  </div>
                </div>
                <div className="w-8/12 p-3 mx-4 border rounded-lg">
                  <div className="px-2 mb-1 text-base font-semibold">
                    Bảng xếp hạng người dùng nổi bật
                  </div>
                  <div>
                    <hr />
                  </div>
                  <div className="mx-4">
                    <List
                      itemLayout="horizontal"
                      dataSource={topUsers}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.information.avatar_url} />}
                            title={<div>{item.information.full_name}</div>}
                            description=""
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="p-3 mx-4 border rounded-lg">
                  <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="line"
                    height={350}
                  />
                </div>
              </div>

              <div className="flex justify-around p-4 mt-2">
                <div className="w-6/12 p-3 mx-4 border rounded-lg">
                  <ReactApexChart
                    options={radarChartData.options}
                    series={radarChartData.series}
                    type="radar"
                    height={350}
                  />
                </div>
                <div className="w-6/12 p-3 mx-4 border rounded-lg">
                  <ReactApexChart
                    options={pieChartData.options}
                    series={pieChartData.series}
                    type="pie"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </IsAdmin>
    </>
  )
}

DashboardRoot.getLayout = getDashboardLayout

export default DashboardRoot
