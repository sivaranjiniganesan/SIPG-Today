import React, { useState, useEffect} from 'react'
import axios from 'axios'
import PhyGold from "./components/PhyGold/PhyGold"
import Navbar from './components/Navbar/Navbar'





const App = () => {
  const [datasource, setData] = useState([{}])
  const [year,setYear] = useState('2024')
  
  const handleClick = ( event) => {
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
    axios.get(`http://localhost:5000/gold-price/${year}`).then(data => {
      setData(data.data)
      console.log(datasource)
    }).catch(error => {
      console.log(error)
    })

  }, [year])
  
  return (
    <div>
     <Navbar/>
     <div className='buttons-year'>
        {yearButton()}
        </div>
     <PhyGold datasource={datasource}/>
    </div>
    
  )
}

export default App



// import React, { useState, useEffect} from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend
// } from "recharts";
// import axios from 'axios'


  

  
// export default function App() {
//   const [datasource,setdata] = useState([{}])
 
//     axios.get('https://sipg-today.onrender.com/gold-price').then(data => {
     
     
//      setdata(data.data)
//      console.log(datasource)
//     })
//   return (
//     <LineChart
//       width={500}
//       height={300}
//       data={datasource}
//       margin={{
//         top: 5,
//         right: 30,
//         left: 20,
//         bottom: 5
//       }}
//     >
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="Date" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
      
//       <Line type="monotone" dataKey="Gold Price(10 Karat)" stroke="#8884d8" activeDot={{ r: 8 }} />
//           <Line type="monotone" dataKey="Gold Price(14 Karat)" stroke="#82ca9d" />
//         <Line type="monotone" dataKey="Gold Price(18 Karat)" stroke="#8884d8" activeDot={{ r: 8 }} />
//           <Line type="monotone" dataKey="Gold Price(22 Karat)" stroke="#82ca9d" />
//         <Line type="monotone" dataKey="Gold Price(24 Karat)" stroke="#82ca9d" />
        
//     </LineChart>
//   );
// }