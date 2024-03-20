import React, { useState, useEffect} from 'react'

const App = () => {
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/member").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
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
