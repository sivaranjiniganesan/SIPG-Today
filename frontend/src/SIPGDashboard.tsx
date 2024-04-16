import React, { useEffect,useState } from 'react';
import Highcharts from 'highcharts';
import Dashboards from '@highcharts/dashboards';
import DataGrid from '@highcharts/dashboards/datagrid';
import Row from './Row';
import Cell from './Cell';
import axios from 'axios';
import SIPG from './components/SIPG/SIPG';


Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

export default function Dashboard() {
//   const { config } = props;

  
//   useEffect(() => {
//     Dashboards.board('sipg', config);
//   }, [config]);

  
 

  return (
    <div id="sipg">
      <Row>
      <div className='title'>Should I purchase Gold Today???</div>
      <div className='sipg_wrapper'>
      <SIPG/>
     
        </div>
      </Row>
      </div>
  );
}
