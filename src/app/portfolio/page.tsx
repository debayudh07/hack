"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveLine } from '@nivo/line'

const portfolioData = [
  {
    id: "Portfolio Value",
    color: "hsl(217, 91%, 60%)",
    data: [
      { x: 'Jan', y: 1000 },
      { x: 'Feb', y: 1200 },
      { x: 'Mar', y: 1100 },
      { x: 'Apr', y: 1400 },
      { x: 'May', y: 1300 },
      { x: 'Jun', y: 1600 },
    ]
  }
]

const investments = [
  { name: 'Stocks', value: 45000, percentage: 60 },
  { name: 'Bonds', value: 15000, percentage: 20 },
  { name: 'Real Estate', value: 7500, percentage: 10 },
  { name: 'Cryptocurrencies', value: 7500, percentage: 10 },
]

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-blue-400 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-blue-300">John Doe</h1>
            <p className="text-blue-500">Financial Portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-700">
            <CardHeader>
              <CardTitle className="text-blue-300">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-400">$75,000</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-blue-700">
            <CardHeader>
              <CardTitle className="text-blue-300">Monthly Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-400">+5.2%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-blue-700 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-300">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveLine
                data={portfolioData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: true,
                  reverse: false
                }}
                yFormat=" >-$"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Month',
                  legendOffset: 36,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Value',
                  legendOffset: -40,
                  legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: '#60A5FA'
                      }
                    },
                    legend: {
                      text: {
                        fill: '#60A5FA'
                      }
                    },
                    ticks: {
                      line: {
                        stroke: '#60A5FA',
                        strokeWidth: 1
                      },
                      text: {
                        fill: '#60A5FA'
                      }
                    }
                  },
                  legends: {
                    text: {
                      fill: '#60A5FA'
                    }
                  },
                  tooltip: {
                    container: {
                      background: '#1F2937',
                      color: '#60A5FA'
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-300">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {investments.map((investment, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-blue-400">{investment.name}</span>
                  <div className="text-right">
                    <span className="text-blue-300">${investment.value.toLocaleString()}</span>
                    <div className="text-sm text-blue-500">{investment.percentage}%</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}