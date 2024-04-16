import React, { useState, useEffect } from 'react'
import "./SIPG.css"
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function SIPG() {
  const choices =
    [
      { text: 'Physical Gold', value: 'physical_gold' },
      { text: 'Digital Gold', value: 'digital_gold' }
    ]
  const [checked, setChecked] = useState(false);

  const [result, setresult] = useState({})
  const [last, setlast] = useState([{}])
  const [show, setshow] = useState(false)
  const [high, sethigh] = useState([{}])
  const [date, setdate] = useState<number>()
  const [url, seturl] = useState<string>('')
  const [type, settype] = useState([])
  const handleChange = (event: any) => {
    setChecked(event.currentTarget.checked)
    console.log(event)
  }




  useEffect(() => {
    axios.get(`${url}`).then(data => {
      console.log(url)
      console.log(data)
      const outerHtmlElement: any = data.data[0];
      var Today_22_1 = outerHtmlElement.highest
      sethigh([Today_22_1])
      var line_chart = outerHtmlElement.Linechart_data
      var last_few = outerHtmlElement.last_few_days
      setresult(
       { 
        chart: {
          zoomType: 'x'
      },
      title: {
          text: 'Gold Rate Variation Since The Purchased',
          align: 'center'
      },
     
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Gold rate(per gram)'
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
        series: {
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        }
    },
      series: line_chart
       }
      )
      setlast(last_few)
      console.log(high)
      setshow(true)
    }).catch(error => {
      console.log(error)
    })
  }, [url]);
  console.log(last)

  



 
  return (
    <div className='sipg'>
      <div className='sipg-input'>
      <div className='sipg-input1'>
        {choices.map((choice, index) => (
          <label key={index}>
            <input type="radio"
              name="vote"
              value={choice.value}
              className={choice.value}
              key={index}
              onClick={(event: any) => settype(event.target.value)} />
            {choice.text}
          </label>
        ))}
        </div>
        <div className='sipg-input2'>
        <h3>When did you purchase last???</h3>
        <input type="date" onChange={(event) => setdate(new Date(event.target.value).valueOf() / 1000)} />
        </div>
        <div className='sipg-input2'>
        <label>
          <input type="checkbox" checked={checked} onChange={handleChange} />
          Check this if never purchased before...
        </label>
        </div>
        <div className='sipg-input2'>
        <button className="find" type="button" onClick={() => seturl("http://localhost:5000/sipg-today/" + type + "/" + date)}>Find Out!!!</button>
        </div>
        </div>
        {show ? <div className='sipg-output'>
          <div className='highest'>
          <text className='sipg-title'>Highest Amount Since The Purchase</text>
          <table id="highest">
                <tr>
                    <th>Date</th>
                    <th>Gold Price(10 Karat)</th>
                    <th>Gold Price(18 Karat)</th>
                    <th>Gold Price(20 Karat)</th>
                    <th>Gold Price(22 Karat)</th>
                    <th>Gold Price(24 Karat)</th>
                </tr>
             
                { high.map((val :any, key :any) => {
                    return (
                        <tr>
                           <td>{val['date']}</td>
                            <td>{val['Gold Price(10 Karat)']}</td>
                            <td>{val['Gold Price(14 Karat)']}</td>
                            <td>{val['Gold Price(18 Karat)']}</td>
                            <td>{val['Gold Price(22 Karat)']}</td>
                            <td>{val['Gold Price(24 Karat)']}</td>
                        </tr>
                    )
                })}
                        
                </table>
                </div>
                <div className='linechart'>
                <HighchartsReact highcharts={Highcharts} options={result} />
                </div>
                <div className='last-content'>
                <text className='sipg-title'>Gold Rate Variation 30days From The Purchase</text>
                <table id="last">
                <tr>
                    <th>Date</th>
                    <th>Gold Price(24 Karat)</th>
                    <th>Gold Price(22 Karat)</th>
                    <th>Gold Price(20 Karat)</th>
                    <th>Gold Price(18 Karat)</th>
                    <th>Gold Price(10 Karat)</th>
                </tr>                                 
                    {Object.values(last).map((val :any) => (
                      <tr>
                      {Object.values(val).map((newval :any) => (
                        <td>{newval}</td>
                      ))}
                      </tr>
                        ))}
                 
                </table>
                </div>
        </div> : null}
      
    </div>
  )
}


