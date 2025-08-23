import { useNavigate } from "react-router-dom";
import "@/styles/settings.scss";
import { LanguageDropdownSheet } from "../ui/LanguageDropdownSheet";
import { useState } from "react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en"); // или подтягивай из user/lang

  const handleSaveLanguage = () => {
    setDropdownOpen(false);
  };
  

  return (
    <div>
      <header>
        <img
          onClick={() => navigate(-1)}
          src='../../src/assets/icons/left-arrow.svg'
          alt=''
        />
        <p>Settings</p>
        <span></span>
      </header>
      <div
        style={{
          margin: "16px",
          borderRadius: "16px",
          boxShadow: "0 2px 4px 2px rgba(0, 0, 0, 0.1)",
          padding: "24px 16px 12px 16px",
        }}
        className='settings-lng-block'
      >
        <div
  className='setting-item-wrapper'
  style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
  onClick={() => setDropdownOpen(true)}
>
  <div>
    <img
      className='setting-left-icon'
      src='../../src/assets/icons/lang-setting-icon.svg'
      alt=''
    />
    <span>Language</span>
  </div>
  <div>
    <span>English</span>
    <img
      className='setting-right-icon'
      src='../../src/assets/icons/right-arrow.svg'
      alt=''
    />
  </div>
</div>
        <div
          className='setting-item-wrapper'
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <img
              className='setting-left-icon'
              src='../../src/assets/icons/leave-settings-icon.svg'
              alt=''
            />{" "}
            <span>Account</span>
          </div>
          <div>
            <span>Exit</span>
            <img
              className='setting-right-icon'
              src='../../src/assets/icons/right-arrow.svg'
              alt=''
            />
          </div>
        </div>
      </div>
      <div
        style={{
          margin: "16px",
          borderRadius: "16px",
          boxShadow: "0 2px 4px 2px rgba(0, 0, 0, 0.1)",
          padding: "24px 16px 12px 16px",
        }}
      >
        <div
          className='setting-item-wrapper'
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <img
              style={{ backgroundColor: "#BA1717" }}
              className='setting-left-icon'
              src='../../src/assets/icons/delete-settings-icon.svg'
              alt=''
            />{" "}
            <span>Delete my account</span>
          </div>
          <div>
            <span style={{ color: "#BA1717", marginRight: "12px" }}>
              Delete
            </span>
            <svg
              width='8'
              height='15'
              viewBox='0 0 8 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1 1.5L7 7.5L0.999999 13.5'
                stroke='#BA1717'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </div>
        </div>
      </div>
      {dropdownOpen && (
  <LanguageDropdownSheet
    open={dropdownOpen}
    setOpen={setDropdownOpen}
    selectedLang={selectedLang}
    setSelectedLang={setSelectedLang}
    onSave={handleSaveLanguage}
  />
)}
    </div>
  );
}
