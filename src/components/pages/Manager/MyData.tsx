import { useSelector } from "react-redux";
import { type RootState } from "@/store";

export default function MyData() {
  const user = useSelector((state: RootState) => state.user.data);

  if (!user) return <div>Loading...</div>;

  return (
    <div className='my-data-container'>
      <header>My Data</header>

      <div className="my-info">
        <h2>My information</h2>
        <div className="name-info">
          <div className="f-name">
            <p>First Name</p>
            <p className='bold'>{user.firstName}</p>
          </div>
          <div className="s-name">
            <p>Second Name</p>
            <p className='bold'>{user.lastName}</p>
          </div>
        </div>
        <div className="phone-number">
          <p>Phone number</p>
          <p className='bold'>{user.phone}</p>
        </div>
        <div className="type">
          <p>Role</p>
          <p className='bold'>Wash manager</p> {/* хардкод */}
        </div>
        <div className="branch">
          <p>Branch</p>
          <p className='bold'>Geocar on Shartava</p> {/* хардкод */}
          <p>57 Zhiuli Shartava St, Tbilisi</p> {/* хардкод */}
        </div>
      </div>

      <div className="my-statistic">
        <h3>My statistic</h3>
        <div className="statistic-button-block">
          <button className='statistic-btn'>Day</button>
          <button className='statistic-btn'>Week</button>
          <button className='statistic-btn'>Month</button>
        </div>
      </div>
    </div>
  );
}
