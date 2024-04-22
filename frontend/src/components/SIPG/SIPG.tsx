import React, { useState, useEffect } from 'react'
import "./SIPG.css"
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Heatmap from "highcharts/modules/heatmap"; 


Heatmap(Highcharts);
    // Calculate the starting weekday index (0-6 of the first date in the given
    // array)
    // before and after the dataset is plotted.
function generateChartData(data:any) {
  

    // Calculate the starting weekday index (0-6 of the first date in the given
    // array)
    const firstWeekday = new Date(data[0].date).getDay(),
        monthLength = data.length,
        lastElement = data[monthLength - 1].date,
        lastWeekday = new Date(lastElement).getDay(),
        lengthOfWeek = 6,
        emptyTilesFirst = firstWeekday,
        chartData = [];

    // Add the empty tiles before the first day of the month with null values to
    // take up space in the chart
    for (let emptyDay = 0; emptyDay < emptyTilesFirst; emptyDay++) {
        chartData.push({
            x: emptyDay,
            y: 5,
            value: null,
            date: null,
            custom: {
                empty: true
            }
        });
    }

    // Loop through and populate with temperature and dates from the dataset
    for (let day = 1; day <= monthLength; day++) {
        // Get date from the given data array
        const date = data[day - 1].date;
        // Offset by thenumber of empty tiles
        const xCoordinate = (emptyTilesFirst + day - 1) % 7;
        const yCoordinate = Math.floor((firstWeekday + day - 1) / 7);
        const id = day;
				const y_co = data[day -1].x
        // Get the corresponding temperature for the current day from the given
        // array
        const price = data[day - 1].price;
        const color = data[day - 1].color;
        if(price == '')
            {
                chartData.push({
                    x: y_co,
                    y: 0,
                    value: null,
                    date: null,
                    custom: {
                        empty: true
                    }
                });
            }
            else{
                chartData.push({
                    x: y_co,
                    y: 8 - yCoordinate,
                    value: price,
                    date: new Date(date).getTime(),
                    custom: {
                        monthDay: id
                    }
                });
            }
        
    }

    // Fill in the missing values when dataset is looped through.
    const emptyTilesLast = lengthOfWeek - lastWeekday;
    for (let emptyDay = 1; emptyDay <= emptyTilesLast; emptyDay++) {
        chartData.push({
            x: (lastWeekday + emptyDay) % 7,
            y: 0,
            value: null,
            date: null,
            custom: {
                empty: true
            }
        });
    }
    return chartData;
}

export default function SIPG() {
  const choices =
    [
      { text: 'Physical Gold', value: 'physical_gold' },
      { text: 'Digital Gold', value: 'digital_gold' }
    ]
  const [checked, setChecked] = useState(false);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [result, setresult] = useState({})
  const [physhow, setphyshow] = useState(false)
  const [digishow, setdigishow] = useState(false)
  const [digishowsuggestion, setdigishowsuggestion] = useState(false)
  const [physhowsuggestion, setphyshowsuggestion] = useState(false)
  const [high, sethigh] = useState([{}])
  const [day, setday] = useState([{}])
  const [date, setdate] = useState<number>(0)
  const [url, seturl] = useState<string>('')
  const [suggestion, setsuggestion] = useState<string>('')
  const [type, settype] = useState('')
  const [sameday, setsameday] = useState('')
  const [heatmap, setheatmap] = useState({})
  const handleChange = (event: any) => {
    setChecked(event.currentTarget.checked)
  }




  useEffect(() => {
    axios.get(`${url}`).then(data => {
      console.log(url)
      const outerHtmlElement: any = data.data[0];
      var Today_22_1 = outerHtmlElement.highest
      sethigh([Today_22_1])
      var Today_values = outerHtmlElement.on_price
      setday([Today_values])
      var same_day =  Today_values['day'][0]
      setsameday(same_day)
      var line_chart = outerHtmlElement.Linechart_data
      var heatmap_data = outerHtmlElement.heatmap_data
      var suggest = outerHtmlElement.result
      setsuggestion(suggest)
      const chartData = generateChartData(heatmap_data);
      setheatmap({
        chart: {
          type: 'heatmap',
          width:900,
          height: 450,
          _styledMode: true
      },
  
      title: {
          text: 'Gold Rate Variation in Last 45 days',
          align: 'center'
      },
      colorAxis: {    
        dataClasses: 
        [{
		from: 0,
        to: 4000,    
        color: '#ffffff'
        }, {
		from: 4000,
          to: 4500,    
          color: '#f6dfe5'
        }, {
		  from: 4500,
          to: 4700,    
          color: '#f2d0d9'
        },
        {
		from: 4700,
        to: 5000,    
        color: '#eec0cc'
        }, {
		from: 5000,
          to: 5200,    
          color: '#eab1c0'
        }, {
		  from: 5200,
          to: 5400,    
          color: '#e5a1b3'
        },
        {
		from: 5400,
        to: 5600,    
        color: '#e192a7'
        }, {
		from: 5600,
          to: 5800,    
          color: '#dd839b'
        }, {
		  from: 5800,
          to: 6000,    
          color: '#d9738e'
        },
        {
            from: 6000,
            to: 6500,    
            color: '#d46482'
            }, {
            from: 6500,
              to: 7000,    
              color: '#d05475'
            }, {
              from: 7000,
              to: 8000,    
              color: '#cc4569'
            }]
    },
      
  
      accessibility: {
          landmarkVerbosity: 'one'
      },
  
      tooltip: {
          enabled: true,
          outside: true,
          zIndex: 20,
          headerFormat: '',
          pointFormat: '{point.date:%A, %b %e, %Y}',
      },
  
      xAxis: {
          categories: weekdays,
          opposite: true,
          lineWidth: 26,
          offset: 13,
          lineColor: 'rgba(27, 26, 37, 0.2)',
          labels: {
              rotation: 0,
              y: 20,
              style: {
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
              }
          },
          accessibility: {
              description: 'weekdays',
              rangeDescription: 'X Axis is showing all 7 days of the week, starting with Sunday.'
          }
      },
  
      yAxis: {
          min: 0,
          max: 7,
          accessibility: {
              description: 'weeks'
          },
          visible: false
      },
  
      legend: {
      enabled:false,
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle'
      },
     
     
  
      series: [{
          keys: ['x', 'y', 'value', 'date', 'id'],
          data: chartData,
          nullColor: 'rgba(196, 196, 196, 0.2)',
          borderWidth: 2,
          borderColor: 'rgba(196, 196, 196, 0.2)',
          dataLabels: [{
              enabled: true,
              format: '{point.value}',
              style: {
                  color: 'black',
                  textOutline: 'none',
                  fontWeight: 'normal',
                  fontSize: '1rem'
              },
              y: 3
          },
          {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            format: '{point.date: %b %e, %Y}',
            backgroundColor: '#b6406b',
            padding: 2,
            style: {
                textOutline: 'none',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                opacity: 0.5
            },
            x: 1,
            y: 1
        }]
      }]
      })
      if (checked){
        setphyshow(false)
        setdigishow(false)
        if(type == "physical_gold")
            {
                setdigishowsuggestion(false)
                setphyshowsuggestion(true)
            }
        else{
            setdigishowsuggestion(true)
              setphyshowsuggestion(false)
        }
              
              
      }
      else{
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
        if(type == "physical_gold")
            {
              setphyshow(true)
              setdigishowsuggestion(false)
              setphyshowsuggestion(true)
              setdigishow(false)
            }
            
          else{
            setphyshow(false)
            setdigishowsuggestion(true)
            setphyshowsuggestion(false)
            setdigishow(true)
          }
      }
      
    
      console.log(type)
      
    }).catch(error => {
      console.log(error)
    })
  }, [url]);
 console.log(day)
  return (
    <div className='sipg'>
      <div className='sipg-input'>
        <div className='style-sipg'>Choose the type</div>
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
        <h3>Pick the last time you purchased</h3>
        <input type="date" onChange={(event) => setdate(new Date(event.target.value).valueOf() / 1000)} />
        </div>
        <div className='sipg-input3'>
        <label>
          <input type="checkbox" checked={checked} onChange={handleChange} />
          Check this if never purchased before...
        </label>
        </div>
        <div className='sipg-input4'>
        <button className="find" type="button" onClick={() => seturl("http://localhost:5000/sipg-today/" + type + "/" + date)}>Find Out!!!</button>
        </div>
        </div>
        <div className='sipg-ouput-segment'>
        {physhow ? <div className='sipg-output'>
          <div className='single_segment'>
          <div className='today_price_segment'>
          <text>{sameday}</text>
          {day.map((val :any, key :any) => {
                    return (
                      <div className='today_price'>
                           <span>{val['date'][0]}</span>
                            <span>{val['Gold Price(22 Karat)'][0]}</span>
                            </div>
                    )
                })}
         </div>
         <div className='highest_price_segment'>
          <text>Highest Price Since the Purchase</text>
          { high.map((val :any, key :any) => {
                    return (
                      <div className='highest_price'>
                           <span>{val['date']}</span>
                            <span>{val['Gold Price(24 Karat)']}</span>
                        </div>
                    )
                })}
         </div>
          </div>
          
          <div className='linechart'>
                <HighchartsReact highcharts={Highcharts} options={result} />
                </div>
        
        </div> : null}
        {
          physhowsuggestion ? <div>
             <div className='heatmap'>
                <HighchartsReact highcharts={Highcharts} options={heatmap} />
                </div>
                <div className='style-suggest'>Suggestion</div>
                <div className='Result'>
                  <h1>{suggestion}</h1>
                </div>
          </div>
          : null}
        {
          digishow ? <div className='sipg-output'>
          <div className='single_segment'>
          <div className='today_price_segment'>
          <text>{sameday}</text>
          {day.map((val :any, key :any) => {
                    return (
                      <div className='today_price'>
                           <span>{val['date'][0]}</span>
                            <span>{val['price'][0]}</span>
                            </div>
                    )
                })}
         </div>
         <div className='highest_price_segment'>
          <text>Highest Price Since the Purchase</text>
          { high.map((val :any, key :any) => {
                    return (
                      <div className='highest_price'>
                           <span>{val['date']}</span>
                            <span>{val['price']}</span>
                        </div>
                    )
                })}
         </div>
          </div>
          
          <div className='linechart'>
                <HighchartsReact highcharts={Highcharts} options={result} />
                </div>
        
        </div> : null
        }
         {
                digishowsuggestion ? <div>
                        <div className='heatmap'>
                            <HighchartsReact highcharts={Highcharts} options={heatmap} />
                            </div>
                            <div className='style-suggest'>Suggestion</div>
                            <div className='Result'>
                            <h2>{suggestion}</h2>
                            </div>
                    </div>
                    : null}
        </div>
    </div>
  )
}


