import React, { useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
  const [data, setData] = useState([{}])
  useEffect(()=>{
    axios.get('https://sipg-today.onrender.com/member').then(data => {
      console.log("SUCCESS", data)
      console.log(data)
    }).catch(error => {
      console.log(error)
    })

  }, [])

  // useEffect(() => {
    
  //   fetch("https://sipg-today.onrender.com/member").then(
  //     res => res.json()
  //   ).then(
  //     data => {
  //       setData(data)
  //       console.log(data)
  //     }
  //   )
  // }, [])
  return (
    <div>
     <h1>Should I Purchase Gold Today??</h1>
     <h2>Gold Price Analysis</h2>
     <h3>------------------------------------------------------------------------------------------------------------Development in Progress-------------------------------------------------------------------------------------------------------</h3>
    </div>
  )
}

export default App
