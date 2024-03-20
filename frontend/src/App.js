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
      {(typeof data.member === 'undefined')? (
        <p>Loading...</p>
      ):(
        data.member.map((member, i ) => (
          <p key={i}>{member}</p>
        ))
      )}
    </div>
  )
}

export default App
