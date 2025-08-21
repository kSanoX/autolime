import leftArrow from "../../assets/icons/left-arrow.svg";
import rightArrow from "../../assets/icons/right-arrow.svg";
import Header from "../Header";
import qrIcon from "../../assets/icons/qr_icon.svg";
import { useUser } from "@/hooks/useUser";
import { useFetchCars } from "@/hooks/useFetchCars";
import { useMyPackages } from "@/hooks/useActivePackages";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState, useEffect } from "react";
import { differenceInMonths } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";


export default function Home() {
  const user = useSelector((state: RootState) => state.user.data);
  const { cars, loading: carsLoading, error: carsError } = useFetchCars();
  const { packages, isLoading: packagesLoading, error: packagesError } = useMyPackages();
  const t = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);


  const [sliderRef, slider] = useKeenSlider(
    cars.length > 0
      ? {
          loop: true,
          mode: "snap",
          slides: {
            perView: 1,
            spacing: 16,
          },
          slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
          },
        }
      : undefined
  );

  useEffect(() => {
    if (slider.current) {
      slider.current.update();
    }
  }, [cars]);  
  

  const selectedCar = cars[currentSlide] ?? null;

  const activePackage = selectedCar
    ? packages.find((p) => p.car.id === selectedCar.id)
    : null;

  const remainingWashes = activePackage
    ? activePackage.number_of_washes - activePackage.used_washes
    : null;

  const totalWashes = activePackage?.number_of_washes ?? null;
  const expirationDate = activePackage?.end_date
    ? new Date(activePackage.end_date).toLocaleDateString()
    : null;
    const packagePeriod =
    activePackage?.start_date && activePackage?.end_date
      ? differenceInMonths(
          new Date(activePackage.end_date),
          new Date(activePackage.start_date)
        )
      : null;  

  return (
    <div>
      <Header logoVariant='image' />
      <main>
        <h3>
        {t("Home.greeting")} <b>{user?.firstName || "Guest"}</b>
        </h3>

        <div className='auto_container'>
          <div className='auto_info'>
            <img
              className='cursor-pointer'
              src={leftArrow}
              alt='arrowToLeft'
              onClick={() => slider?.current?.prev()}
            />
            <div className='auto_number_container'>
              <h2>
                <b>{carsLoading ? "..." : selectedCar?.plate || "No plate"}</b>
              </h2>
              <p>{carsLoading ? "..." : selectedCar?.type || "Unknown type"}</p>
              {carsError && <p className='error'>{t("Booking.fallback.error")}</p>}
            </div>
            <img
              className='cursor-pointer'
              src={rightArrow}
              alt='arrowToRight'
              onClick={() => slider?.current?.next()}
            />
          </div>

          {carsLoading ? null : (
            <div className='keen-slider' ref={sliderRef}>
              {cars.map((car) => (
                <div className='keen-slider__slide' key={car.id}>
                  <div className='auto_images'>
                    <div className='hatchback_qr'>
                      <img src={qrIcon} alt='QR icon' />
                    </div>
                    <img
                      src='/images/hatchback_image.png'
                      alt='hatchback_image'
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='whashes_info'>
            <div className='whashes_info-block'>
              <div className='info-block header'>
                <span>
                  <img src='../../src/assets/icons/whashes.svg' alt='whashes' />
                </span>
                <p>{t("Home.washes.title")}</p>
              </div>
              <h2>{remainingWashes ?? "--"}</h2>
              <p className='status'>{t("Home.washes.remaining")}</p>
              <div className='data'>
                {remainingWashes != null && totalWashes != null
                  ? `${remainingWashes}/${totalWashes}`
                  : "--"}
              </div>
            </div>

            <div className='whashes_info-block'>
              <div className='info-block header'>
                <span>
                  <img src='../../src/assets/icons/time.svg' alt='time' />
                </span>
                <p>{t("Home.period.title")}</p>
              </div>
              <h2>
  {packagePeriod ?? "--"} <span>{t("Home.period.unit")}</span>
</h2>
              <p className='status'>{t("Home.period.expiration")}</p>
              <div className='data'>{expirationDate ?? "--"}</div>
            </div>
          </div>

          <div className='home-slider-container'>
            {cars.map((_, index) => (
              <div
                key={index}
                className={`home-slider ${
                  index === currentSlide ? "active" : ""
                }`}
              ></div>
            ))}
          </div>

          <div className='promo'>
            <div className='promo-text'>
              <p className='promo-regular-text'>{t("Home.promo.regular")}</p>
              <p className='promo-bold-text'>
                <span>{t("Home.promo.bold")}</span>
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
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
