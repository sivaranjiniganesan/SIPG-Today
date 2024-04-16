import React from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highstock";

const DigiGold = (data: any) => {
    console.log(data)

  
    const options = {
        sync: {
          visibility: true,
          highlight: true,
          extremes: true,
        },
       
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        chart:{
            height: 490,
            width: 850
        },
      title: {
          text: `Digital Gold Price in India ${data.data[1000]}`,
          align: 'center'
      },
     
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Price per Gram'
          },
          
          tickInterval: 500
      },
      legend: {
          enabled: true
      },
      series: data.data
      };
  return (
    <HighchartsReact
    highcharts={Highcharts}
    constructorType={"stockChart"}
    options={options}
  />
  )
}

export default DigiGold
