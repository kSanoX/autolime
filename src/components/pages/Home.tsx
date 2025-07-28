import "../../styles/home.scss"
import leftArrow from "../../assets/icons/left-arrow.svg"
import rightArrow from "../../assets/icons/right-arrow.svg"

export default function Home() {
  return (
    <main>
      <h3>Hello, <b>Anna!</b></h3>
      <div className="auto_container">
        <div className="auto_info">
          <img className="cursor-pointer" src={leftArrow} alt="arrowToLeft" />
          <div className="auto_number_container">
            <h2><b>AR - 111 - TT</b></h2>
            <p>Hatchback</p>
          </div>
          <img src={rightArrow} alt="arrowToRight" />
        </div>
      </div>
    </main>
  )
}
