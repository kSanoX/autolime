import { motion } from "framer-motion";
import React from "react";

export function LanguageDropdownSheet({
  open,
  setOpen,
  selectedLang,
  setSelectedLang,
  onSave,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  onSave: () => void;
}) {
  if (!open) return null;

  const LANGUAGES = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ka", label: "Georgian", flag: "🇬🇪" },
    { code: "ru", label: "Russian", flag: "🇷🇺" },
  ];
  const FLAG_MAP: Record<string, string> = {
    en: "/src/assets/icons/english-flag.svg",
    ru: "/src/assets/icons/russian-flag.svg",
    ka: "/src/assets/icons/georgian-flag.svg",
  };
  

  return (
    <>
      {/* Затемнённый фон */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(24, 61, 105, 0.5)",
          zIndex: 999,
        }}
      />

      {/* Дропдаун */}
      <motion.div
        drag='y'
        dragConstraints={{ top: 0, bottom: 100 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 50) setOpen(false);
        }}
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        exit={{ y: 400 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          minHeight: "375px",
          overflowY: "auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          cursor: "grab",
          padding: "16px",
          width: "100%",
          maxWidth: "480px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className='language-sheet-wrapper'>
          <div className='language-sheet-header'>
            <div className='drag-indicator' />
            <h3>Choose the application language</h3>
          </div>

          <ul className='language-options'>
            {LANGUAGES.map(({ code, label }) => (
              <li
                key={code}
                className={`language-option ${
                  selectedLang === code ? "selected" : ""
                }`}
                onClick={() => setSelectedLang(code)}
              >
                <div className='radio-circle'>
                  {selectedLang === code && <div className='radio-dot' />}
                </div>
                <span>{label}</span>
                <img src={FLAG_MAP[code]} alt={`${label} flag`} />
              </li>
            ))}
          </ul>
          <button
            className='save-button'
            disabled={!selectedLang}
            onClick={onSave}
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </>
  );
}
