import axios from 'axios'
import React, { useState, useEffect} from 'react'
import './style.css';
import Dashboard from './Dashboard';
import Navbar from './components/Navbar/Navbar';




export default function App() {

const [config,setConfig] = useState({})
// let current_data: {} as any
useEffect(()=>{
  axios.get('http://localhost:5000/current-gold-price').then(data => {
    const outerHtmlElement: any = data.data[0];
    var Today_22_1 = outerHtmlElement.Today['22K Gold'][0];
    var Today_22_10 = outerHtmlElement.Today['22K Gold'][1];
    var Today_24_1 = outerHtmlElement.Today['24K Gold'][0];
    var Today_24_10 = outerHtmlElement.Today['24K Gold'][1];
    let last_10: any = outerHtmlElement.last_10_days
    var digigold = outerHtmlElement.digigold_today
    var last_10_digigold = outerHtmlElement.digigold_last_10
    let last_10_22: any = []
    let last_10_24: any = []
    console.log(last_10)
    Object.keys(last_10).map(key => {
      last_10_22.push(Number(last_10[key][1]))
   });
   console.log(last_10_22)
  //  last_10_22 = last_10_22.slice(1)
   console.log(last_10_digigold)
   Object.keys(last_10).map(key => {
    last_10_24.push(Number(last_10[key][2]))
 });
 last_10_24 = last_10_24.slice(1)
    setConfig({
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
              type: 'line',
              enableMouseTracking: false,
              dataLabels: {
                  enabled: true
              },
              name: 'Last 6 months rate',
              data: last_10_22
          }]
        }
        },
        {
          type: 'KPI',
          cell: 'kpi-digigold-today',
          value: digigold,
          valueFormat: '{value}',
          title: "Today's Digitial Gold Rate",
          subtitle: "Last 10 day's rate",
          chartOptions: {
            series: [{
              type: 'line',
              enableMouseTracking: false,
              dataLabels: {
                  enabled: true
              },
              name: 'Last 6 months rate',
              data: last_10_digigold
          }]
        }
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
  }).catch(error => {
    console.log(error)
  })

}, [])





console.log(config)
  
  return (
    <div>

<Navbar/>
<Dashboard config={config} /> 
    </div>
  
);
}


