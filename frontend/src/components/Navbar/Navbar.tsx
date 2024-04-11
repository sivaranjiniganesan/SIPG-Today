import React from 'react'
import "./Navbar.css";

const Navbar = () => {
  return (
    <section className='nav-content'>
        <div className='Text'>
        <text className='nav-title'>SIPG Today???</text>
      <text className='nav-subtitle'>Should I Purchase Gold Today...</text>
        </div>
      
        <div className='nav-buttons'>
    
        <ul className="nav-buttons-items" >
                <li>
                    <a href='#container'>Physical Gold</a>
                </li>
                <li>
                    <a href='#digigold'>Digital Gold</a>
                </li>
                <li>
                    <a href='#predict'>SIPG Today???</a>
                </li>
            </ul>
        </div>
        </section>
  )
}

export default Navbar