import React, { useState } from "react";
import PercentBar from "../PercentBar";
import { MobileDropdownSheet } from "../ui/MobileDropdown";
import { Button } from "../ui/button";

export default function CarwashStatistics() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Period");

  return (
    <div>
      <header>Carwash statistics</header>
      <div className='branch-block'>
        <h4>Branch</h4>
        <div className='branch-info'>
          <div className='branch-info-header'>
            <div>
              <p className='bold'>Geocar on Shartava</p>
              <p>57 Zhiuli Shartava St, Tbilisi</p>
            </div>
            <button className='branch-open-btn'>Open</button>
          </div>
          <div className='branch-time'>
            <p>
              Mn - Fr <span className='yellow'>9:00 - 17:00</span>
            </p>
            <div className='dot'></div>
            <p>
              St - Sn <span className='yellow'>11:00 - 15:00</span>
            </p>
          </div>

          <div className='period'>
            <div className='period-dropdown'>
              <p>{selectedPeriod}</p>
              <button onClick={() => setDropdownOpen(true)} className='ml-2'>
                <img
                  className='right-arrow'
                  src='../../src/assets/icons/right-arrow.svg'
                  alt='right-arrow'
                />
              </button>
            </div>

            <MobileDropdownSheet
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              setPeriod={setSelectedPeriod}
            />
          </div>
        </div>
      </div>
      <div className='count-whashes'>
        <div className='whashes-img'>
          <img src='../../src/assets/icons/whashes.svg' alt='whashes' />
        </div>
        <div className='whashes-flex'>
          <div className='whashes-info'>
            <p>Whashes</p>
            <p className='yellow'>Period:</p>
            <p>15/06/2023 - 23/06/2023</p>
          </div>
          <div className='stats'>---</div>
        </div>
      </div>
      <div className='packeges'>
        <div className='packeges-header'>
          <div className='yellow-box'>
            <img src='./../../src/assets/icons/branch/package.svg' alt='' />
          </div>
          <div>
            <p>Packeges</p>
            <p className='yellow'>Distribution by package</p>
          </div>
        </div>
        <div>
          <PercentBar percent={46} label='12 whashes' />
        </div>
        <div>
          <PercentBar percent={46} label='24 whashes' />
        </div>
        <div>
          <PercentBar percent={8} label='Unlimit whashes' />
        </div>
      </div>

      <div className='car-types-wrapper'>
        <div className='packeges-header'>
          <div className='yellow-box'>
            <img
              src='./../../src/assets/icons/branch/branch-header-car.svg'
              alt=''
            />
          </div>
          <div>
            <p>Car types</p>
            <p className='yellow'>Distribution by car types</p>
          </div>
        </div>

        <div className='car-types-list'>
          <div className='car-types-row'>
            <div className='blue-box'>
              <img src='../../src/assets/icons/branch/sedan.svg' alt='sedan' />
            </div>
            <div className='bar-container'>
              <PercentBar percent={64} label='Sedan' />
            </div>
          </div>

          <div className='car-types-row'>
            <div className='blue-box'>
              <img src='../../src/assets/icons/branch/wagon.svg' alt='wagon' />
            </div>
            <div className='bar-container'>
              <PercentBar percent={25} label='Wagon' />
            </div>
          </div>

          <div className='car-types-row'>
            <div className='blue-box'>
              <img src='../../src/assets/icons/branch/coupe.svg' alt='cope' />
            </div>
            <div className='bar-container'>
              <PercentBar percent={20} label='Coupe' />
            </div>
          </div>

          <div className='car-types-row'>
            <div className='blue-box'>
              <img
                src='../../src/assets/icons/branch/pickup.svg'
                alt='pickup'
              />
            </div>
            <div className='bar-container'>
              <PercentBar percent={9} label='Pickup' />
            </div>
          </div>
        </div>
      </div>

      <div className='workload'>
        <div className='packeges-header'>
          <div className='yellow-box'>
            <img src='./../../src/assets/icons/branch/workload.svg' alt='' />
          </div>
          <div>
            <p>Workload</p>
            <p>
              <span className='yellow'> Period:</span> 15/06/2023 - 23/06/2023
            </p>
          </div>
        </div>
        <div className='graphics-container'>
          <div className='graph'></div>
          <div className='graph-info'>
            <div className='graph-info-item'>15Jun</div>
            <div className='graph-info-item'>17DEC</div>
            <div className='graph-info-item'>19DEC</div>
            <div className='graph-info-item'>21DEC</div>
            <div className='graph-info-item'>23Jun</div>
          </div>
          <div className='avg-whashes'>
            <div>
              <p className='yellow'>Average number of washes:</p>
              <p>Per Day</p>
            </div>
            <span>-</span>
          </div>
        </div>
      </div>
    </div>
  );
}
