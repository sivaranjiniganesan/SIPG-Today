import React, { useEffect,useState } from 'react';
import Highcharts from 'highcharts';
import Dashboards from '@highcharts/dashboards';
// import DataGrid from '@highcharts/dashboards/datagrid';
import Row from './Row';
import Cell from './Cell';
import axios from 'axios';
import PhyGold from './components/PhyGold/PhyGold';



Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
// Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

export default function Dashboard(props: any) {
  const { config } = props;

  
  useEffect(() => {
    Dashboards.board('physical_gold', config);
  }, [config]);

  const [datasource, setData] = useState([{}])

  const [year,setYear] = useState('2024')
  
  const handleClick = ( event: any) => {
    console.log(event)
    const year = event.target.textContent;
    console.log("the text: ", year);
    setYear(year)
  };
  const yearButton = () => {
    const array = ['2024','2023','2022','2021','2020','2019','2018','2017']
  
    return array.map((number) => {
      return <button className="year-button" onClick={handleClick} type="button">{number}</button>
    })
  }

 
  
  useEffect(()=>{
    axios.get(`https://sipg-today.onrender.com/gold-price/${year}`).then(data => {
      console.log(data)
      const data_dum = data.data
      data_dum[1000] = year
      console.log(data_dum)
      setData(data_dum)
    }).catch(error => {
      console.log(error)
    })

  }, [year])

  return (
    
      <div id="physical_gold">
      <div className='title'>Physical Gold Price Variation</div>
      <Row>
        <div id="kpi-wrapper" className='row-1'>
          <Cell id="kpi-gold-today" />
          <div id="wrapper">
          <div id="single-wrapper1">
          <Cell id="text-1"/>
          <Cell id="aaa" />
          <Cell id="bbb" />
          </div>
          <div id="single-wrapper2">
          <Cell id="text-2"/>
          <Cell id="ccc" />
          <Cell id="ddd" />
         </div>
          </div>
          
        </div>
        <div id="dashboard-col-0" className='row-1'>
        <div className='buttons-year'>
        {yearButton()}
        </div>
        <PhyGold datasource={datasource}/>
        </div>
      </Row>
      </div>
     

  );
}
