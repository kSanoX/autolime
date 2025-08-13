import leftArrow from "../../assets/icons/left-arrow.svg";
import rightArrow from "../../assets/icons/right-arrow.svg";
import Header from "../Header";
import qrIcon from "../../assets/icons/qr_icon.svg"
import { useUser } from "@/hooks/useUser";
import { useFetchCars } from "@/hooks/useFetchCars";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

export default function Home() {
  const { user, loading, error } = useUser();
  const { cars, loading: carsLoading, error: carsError } = useFetchCars();
  const selectedCar = cars[0]; // или позже сделаешь выбор через слайдер
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 16,
    },
  });


  return (
    <div>
    <Header logoVariant="image"/>
    <main>
    <h3>
          Hello, <b>{loading ? "..." : user?.firstName || "Guest"}</b>
        </h3>
        {error && <p className="error">Failed to load user</p>}
      <div className='auto_container'>
        <div className='auto_info'>
          <img className='cursor-pointer' src={leftArrow} alt='arrowToLeft' />
          <div className='auto_number_container'>
          <h2>
  <b>{carsLoading ? "..." : selectedCar?.plate || "No plate"}</b>
</h2>
<p>{carsLoading ? "..." : selectedCar?.type || "Unknown type"}</p>
{carsError && <p className="error">Failed to load cars</p>}
          </div>
          <img src={rightArrow} alt='arrowToRight' />
        </div>
        <div className='auto_images'>
          <div className='hatchback_qr'>
            <img src={qrIcon} alt="" />
          </div>

          <img
            src='../../../public/images/hatchback_image.png'
            alt='hatchback_image'
          />
        </div>
        <div className='whashes_info'>
          <div className='whashes_info-block'>
            <div className='info-block header'>
              <span>
                <img src='../../src/assets/icons/whashes.svg' alt='whashes' />
              </span>
              <p>Whashes</p>
            </div>
            <h2>20</h2>
            <p className='status'>remaining</p>
            <div className='data'>20/24</div>
          </div>
          <div className='whashes_info-block'>
            <div className='info-block header'>
              <span>
                <img src='../../src/assets/icons/time.svg' alt='time' />
              </span>
              <p>Period</p>
            </div>
            <h2>
              12 <span>month</span>
            </h2>
            <p className='status'>expiration date</p>
            <div className='data'>05/05/2025</div>
          </div>
        </div>
        <div className='home-slider'>
          <div className='home-slider active'></div>
          <div></div>
        </div>
        <div className='promo'>
          <div className='promo-text'>
            <p className='promo-regular-text'>специальное предложение</p>
            <p className='promo-bold-text'>
              ПОЛУЧИ <span> 10% СКИДКИ</span> <br /> ПРОДЛИВШИ ПОДПИСКУ
            </p>
          </div>
          <a href='/'>
            <svg
              width='8'
              height='15'
              viewBox='0 0 8 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1 1.5L7 7.5L0.999999 13.5'
                stroke='#fff'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
    </div>
  );
}
