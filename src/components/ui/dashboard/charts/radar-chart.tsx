import {
  Chart as ChartJS,
  ChartData,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js'
import React from 'react'
import { Radar } from 'react-chartjs-2'
import colors from 'tailwindcss/colors'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface DataSet {}

interface RadarChartData extends ChartData<'radar', number[], string> {}

export const defaultData = {
  labels: ['Đấu giá', 'Trao đổi', 'Mua bán'],
  datasets: [
    {
      label: 'Số lượng',
      data: [5, 12, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
}

interface RadarChartProps {
  data?: RadarChartData
}

export function RadarChart({ data }: RadarChartProps) {
  return <Radar data={defaultData} />
}
