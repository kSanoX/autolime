export default function CustomerMyData() {
  return (
    <div className="customer-data-container">
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src="../../../src/assets/icons/left-arrow.svg" alt="left-arrow-icon" />
        <h2>My Data</h2>
        <img src="../../../src/assets/icons/customer-data-save.svg" alt="save-data-icon" />
      </header>

      <div className="customer-data-wrapper">
        <form className="customer-data-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="---" />
          </div>

          <div className="form-group">
            <label htmlFor="secondName">Second Name</label>
            <input type="text" id="secondName" placeholder="---" />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <div className="input-with-icon">
              <input type="text" id="dob" placeholder="--/--/----" />
              <img src="../../../src/assets/icons/calendar-icon.svg" alt="calendar" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sex">Sex</label>
            <div className="input-with-icon">
              <select id="sex" defaultValue="">
                <option value="" disabled>---</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <img src="../../../src/assets/icons/dropdown-arrow.svg" alt="dropdown arrow" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
