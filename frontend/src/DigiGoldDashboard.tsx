import React, { useEffect,useState } from 'react';
import Highcharts from 'highcharts';
import Dashboards from '@highcharts/dashboards';
import DataGrid from '@highcharts/dashboards/datagrid';
import Row from './Row';
import Cell from './Cell';
import axios from 'axios';
import DigiGold from './components/DigiGold/DigiGold';



Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
// Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

export default function Dashboard(props: any) {
  const { config } = props;

  
  useEffect(() => {
    Dashboards.board('digital_gold', config);
  }, [config]);

  const [digital_data, setdigiData] = useState([{}])
  const [year,setYear] = useState('2024')
  
  const handleClick = ( event: any) => {
    console.log(event)
    const year = event.target.textContent;
    console.log("the text: ", year);
    setYear(year)
  };
 

  const digiyearButton = () => {
    const array = ['2024','2023','2022','2021','2020']
  
    return array.map((number) => {
      return <button className="year-button" onClick={handleClick} type="button">{number}</button>
    })
  }
  


  useEffect(()=>{
    axios.get(`https://sipg-today.onrender.com/digital-gold-price/${year}`).then(data => {
    const data_dum = data.data
    data_dum[1000] = year
    console.log(data_dum)
      setdigiData(data_dum)
    }).catch(error => {
      console.log(error)
    })

  }, [year])

  // console.log(digital_data)


 

  return (
    
      
      <div id="digital_gold">
      <Row>
      <div className='title'>Digital Gold Price Variation</div>
      <div className='digital_gold_wrapper'>
      <div id="single-wrapper3">
          <Cell id="kpi-digigold-today" />
          </div>
      <div id="dashboard-col-1" className='row-2'>
      <div className='buttons-year'>
        {digiyearButton()}
        </div>
        {/* <Cell id="dashboard-col-2" /> */}
        <DigiGold data={digital_data}/>
        </div>
        </div>
      </Row>
      </div>
     
      
  );
}
