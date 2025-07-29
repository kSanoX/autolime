import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function MyData() {
  return (
    <div className='my-data-container'>
    <header>
      My Data
    </header>
    <div className="my-info">
      <h2>My information</h2>
      <div className="name-info">
        <div className="f-name">
          <p>Fiest Name</p>
          <p className='bold'>Ivy</p>
        </div>
        <div className="s-name">
          <p>Second name</p>
          <p className='bold'>Levan</p>
        </div>
        </div>
        <div className="phone-number">
          <p>Phone number</p>
          <p className='bold'>+995 500 500 555</p>
        </div>
        <div className="type">
          <p>Phone number</p>
          <p className='bold'>Wash manager</p>
        </div>
        <div className="branch">
          <p>Branch</p>
          <p className='bold'>Geocar on Shartava</p>
          <p >57 Zhiuli Shartava St, Tbilisi</p>
        </div>
    </div>
    <div className="my-statistic">
      My statistic
      <div className="statistic-button-block">
      <button className='statistic-btn'>Day</button>
      <button className='statistic-btn'>Wek</button>
      <button className='statistic-btn'>Month</button>
      </div>
    </div>
    </div>
  )
}
