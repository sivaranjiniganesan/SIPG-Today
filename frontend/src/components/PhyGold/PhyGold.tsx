import React from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highstock";
import "./PhyGold.css"


const PhyGold = (datasource: any) => {
   
  const options = {
    sync: {
      visibility: true,
      highlight: true,
      extremes: true,
    },
   
    cell: 'dashboard-col-0',
    type: 'Highcharts',
    chart:{
        height: 530,
        width: 900
    },
  title: {
      text: `Gold Price in India ${datasource.datasource[1000]} (24K, 22K, 18K, 14K & 10K)`,
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
  series: datasource.datasource
  };
  return (
    
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
      
  
  )
}

export default PhyGold