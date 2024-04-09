import React from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highstock";
import "./PhyGold.css"


const PhyGold = (datasource) => {
   
    console.log(datasource.datasource)
  const options = {
    chart:{
        height: 530,
        width: 900
    },
  title: {
      text: 'Gold Price in India 2023 (24K, 22K, 18K, 14K & 10K)',
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
    <div id="container">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
      
    </div>
  )
}

export default PhyGold
