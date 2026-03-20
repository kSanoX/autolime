import { useNavigate } from "react-router-dom";
import "@/styles/settings.scss";
import { LanguageDropdownSheet } from "../ui/LanguageDropdownSheet";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { setLanguage } from "@/store/langSlice";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const currentLang = useSelector((s: RootState) => s.lang.currentLang);
  const [selectedLang, setSelectedLang] = useState<RootState["lang"]["currentLang"]>(currentLang);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const languageLabel =
    currentLang === "en" ? "English" : currentLang === "ru" ? "Russian" : "Georgian";

  const handleSaveLanguage = () => {
    dispatch(setLanguage(selectedLang));
    setDropdownOpen(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    location.reload();
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
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
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
            <span>{languageLabel}</span>
            <img
              className='setting-right-icon'
              src='../../src/assets/icons/right-arrow.svg'
              alt=''
            />
          </div>
        </div>
        <div
          className='setting-item-wrapper'
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setLogoutModalOpen(true)}
        >
          <div>
            <img
              className='setting-left-icon'
              src='../../src/assets/icons/leave-settings-icon.svg'
              alt=''
            />
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
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setDeleteModalOpen(true)}
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
      {logoutModalOpen && (
        <div className='modal-backdrop'>
          <div className='modal-window'>
            <h2>Sign Out</h2>
            <h3>Are you sure you want to leave the app?</h3>
            <div className='modal-actions'>
              <button onClick={() => setLogoutModalOpen(false)}>Cancel</button>
              <button onClick={handleLogout}>Leave</button>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && (
  <div className="modal-backdrop">
    <div className="modal-window">
      <h2 style={{color: "#BA1717"}}>Delete your account?</h2>
      <h3>You will lose all your data by deleting your account. This action cannot be undone.</h3>
      <div className="modal-actions">
        <button onClick={() => setDeleteModalOpen(false)}>No</button>
        <button
          onClick={() => {
            console.log("Account deletion confirmed");
            setDeleteModalOpen(false);
          }}
        >
          Yes, delete
        </button>
      </div>
    </div>
  </div>
)}

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
