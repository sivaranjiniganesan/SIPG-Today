import axios from 'axios'
import React, { useState, useEffect} from 'react'
import './style.css';
import Navbar from './components/Navbar/Navbar';
import DigiGoldDashboard from "./DigiGoldDashboard";
import PhyGoldDashboard from "./PhyGoldDashboard";
import SIPGDashboard from "./SIPGDashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@fontsource/jura"

export default function App() {

const [configPhy,setConfigPhy] = useState({})
const [configDigi,setConfigdigi] = useState({})
// let current_data: {} as any
useEffect(()=>{
  axios.get('https://sipg-today.onrender.com/current-gold-price').then(data => {
    const outerHtmlElement: any = data.data[0];
    var Today_22_1 = outerHtmlElement.Today['22K Gold'];
    var Today_22_10 = outerHtmlElement.Today['22K Gold'] * 10;
    var Today_24_1 = outerHtmlElement.Today['24K Gold'];
    var Today_24_10 = outerHtmlElement.Today['24K Gold'] * 10;
    let last_10: any = outerHtmlElement.last_10_days
    var digigold = outerHtmlElement.digigold_today
    var last_10_digigold = outerHtmlElement.digigold_last_10
    let last_10_22: any = []
    let last_10_24: any = []
    console.log("Today_22_1")
    console.log(Today_22_1)

    setConfigPhy({
      components: [

        {
          type: 'KPI',
          cell: 'kpi-gold-today',
          value: Today_22_1,
          valueFormat: '{value}',
          title: "Today's Gold Rate",
          subtitle: "Last 10 day's rate",
         
          chartOptions: {
            series: [{
              type: 'column',
              enableMouseTracking: false,
              dataLabels: {
                  enabled: true
              },
              name: 'Last 6 months rate',
              data: last_10
          }]
        }
        },
        {
          cell: 'text-1',
          type: 'KPI',
          value: '22K',
          valueFormat: '{value}',
         
        },
        {
          cell: 'aaa',
          type: 'KPI',
          value: Today_22_1,
          title: '1gm',
          valueFormat: '{value}',
         
        },
        {
          cell: 'bbb',
          type: 'KPI',
          value: Today_22_10,
          title: '10gms',
          valueFormat: '{value}',
         
        },
        {
          cell: 'text-2',
          type: 'KPI',
          value: '24K',
          valueFormat: '{value}',
         
        },
        {
          cell: 'ccc',
          type: 'KPI',
          value: Today_24_1,
          title: '1gm',
          valueFormat: '{value}',
         
        },
        {
          cell: 'ddd',
          type: 'KPI',
          value: Today_24_10,
          title: '10gms',
          valueFormat: '{value}',
         
        }
      ]
    })
    setConfigdigi(
      {components: [
      
      {
        type: 'KPI',
        cell: 'kpi-digigold-today',
        value: digigold,
        valueFormat: '{value}',
        title: "Today's Digitial Gold Rate",
        subtitle: "Last 10 day's rate",
        chartOptions: {
          series: [{
            type: 'column',
            enableMouseTracking: false,
            dataLabels: {
                enabled: true
            },
            name: 'Last 6 months rate',
            data: last_10_digigold
        }]
      }
      }]})
  }).catch(error => {
    console.log(error)
  })

}, [])





// console.log(config)
  
  return (
    <div className='SIPG-App'>

<Navbar/>

<BrowserRouter>
      <Routes>
      <Route path="/" element={<PhyGoldDashboard  config={configPhy}/>}>
          </Route>
        <Route path="/physical_gold" element={<PhyGoldDashboard  config={configPhy}/>}>
          </Route>
          <Route path="/digital_gold" element={<DigiGoldDashboard  config={configDigi}/>}>
          </Route>
          <Route path="/sipg" element={<SIPGDashboard/>}>
          </Route>
          </Routes>
          </BrowserRouter>


    </div>
  
);
}


