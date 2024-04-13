import React, {useState} from 'react'

function SIPG() {
const [checked, setChecked] = useState(false);
const handleChange = (event: any) => {
    setChecked(event.currentTarget.checked)
    console.log(event)
  }
  
  return (
    <div>
        <div className='sipg-input'> 
        <h3>When did you purchase last???</h3>
        {!checked && (
      <input type="date"/>
        )}
        <label>
        <input type="checkbox" checked={checked} onChange={handleChange} />
        Never Purchased...
      </label></div>
    </div>
  )
}

export default SIPG
