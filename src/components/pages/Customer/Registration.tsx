import React, { useState } from "react";
import OTPVerification from "../../OTPVerification";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Registration() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<{ phone?: string; password?: string }>({});
  const [stage, setStage] = useState<"register" | "verify" | "set-password">("register");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const [tempCode, setTempCode] = useState<number | null>(null);
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let raw = e.target.value;
    raw = raw.replace(/[^\d+]/g, "");
    if (raw.includes("+")) {
      raw = "+" + raw.replace(/\+/g, "").slice(0, 12);
    }
    setPhone(raw);
    if (error.phone) setError((prev) => ({ ...prev, phone: undefined }));
  };

  const handleRegister = async () => {
    const cleanedPhone = phone.replace(/[^\d]/g, ""); // только цифры
  
    if (!cleanedPhone) {
      setError({ phone: "empty" });
      return;
    }
  
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ phone: cleanedPhone }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setTempCode(data.temp_code);
        setStage("verify");
      } else {
        console.log("Ошибка:", data.error);
        setError({ phone: data.error });
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  };  
  

  const handleOTPVerified = () => {
    setStage("set-password");
  };
  const handleFinishRegistration = async () => {
    if (password.length < 6) {
      setError({ password: "too-short" });
      return;
    }
  
    try {
      const res = await fetch(`${API_URL}/register/set_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          password,
          temp_code: tempCode,
        }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/add-car");
      } else {
        setError({ password: "server-error" });
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError({ password: "network" });
    }
  };
  
  

  if (stage === "verify" && tempCode) {
    return <OTPVerification tempCode={tempCode} onSuccess={handleOTPVerified} />;
  }

  if (stage === "set-password") {
    return (
      <div className="auth-wrapper">
        <div className="auth-logo-block">
          <img src="../../../src/assets/logo.svg" alt="LOGO" />
        </div>

        <div className="auth-greetings">
          <h1>Set your password</h1>
          <p>Choose a secure password to complete registration</p>
        </div>

        {error.password === "too-short" && (
          <div className="incorrect-password-error">
            <p>Password must be at least 6 characters</p>
          </div>
        )}

        <div className="auth-input-block">
          <div className="auth-password-input">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error.password) setError((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Create your password"
                className="custom-input"
              />
              <svg
                className={`input-icon ${showPassword ? "active" : ""}`}
                onClick={togglePassword}
                width="22"
                height="17"
                viewBox="0 0 22 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.0689978 7.92177C1.803 3.47977 5.884 0.285767 11 0.285767C16.116 0.285767 20.197 3.47977 21.932 7.92177C22.0235 8.15581 22.0235 8.41572 21.932 8.64977C20.197 13.0918 16.116 16.2858 11 16.2858C5.884 16.2858 1.803 13.0918 0.0689978 8.64977C-0.0224703 8.41572 -0.0224703 8.15581 0.0689978 7.92177ZM11 11.2858C11.7956 11.2858 12.5587 10.9697 13.1213 10.4071C13.6839 9.84448 14 9.08142 14 8.28577C14 7.49012 13.6839 6.72706 13.1213 6.16445C12.5587 5.60184 11.7956 5.28577 11 5.28577C10.2043 5.28577 9.44129 5.60184 8.87868 6.16445C8.31607 6.72706 8 7.49012 8 8.28577C8 9.08142 8.31607 9.84448 8.87868 10.4071C9.44129 10.9697 10.2043 11.2858 11 11.2858Z"
                  fill={showPassword ? "#F5A623" : "#183D69"}
                />
              </svg>
            </div>
          </div>

          <div className="sign-in">
            <button onClick={handleFinishRegistration}>Finish</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-logo-block">
        <img src="../../../src/assets/logo.svg" alt="LOGO" />
      </div>

      <div className="auth-greetings">
        <h1>Create account</h1>
        <p>Please enter your phone number <br /> to register</p>
      </div>

      {error.phone === "duplicate" && (
        <div className="phone-number-doesnt-exist-error">
          <p>Phone number already exists</p>
        </div>
      )}
      {error.phone === "invalid-format" && (
        <div className="phone-number-doesnt-exist-error">
          <p>Phone number is incorrect</p>
        </div>
      )}

      <div className="auth-input-block">
        <div className="auth-phone-input">
          <label>Phone number</label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={13}
            placeholder="+380XXXXXXXXX"
            className="custom-input"
          />
        </div>

        <div className="sign-in">
          <button onClick={handleRegister}>Sign Up</button>
        </div>
      </div>

      <div className="sign-up-navigate">
        <p>Already have an account? <Link to="/auth"> Sign In</Link></p>
      </div>

      <div className="auth-separator">
        <hr />
        <p>OR</p>
        <hr />
      </div>

      <div className="alternative-servives-auth">
        <div className="google-auth">
          <a href="/"><img src="../../../src/assets/icons/google-service (1).svg" alt="google" /></a>
          <p>Google</p>
        </div>
        <div className="facebook-auth">
          <a href="/"><img src="../../../src/assets/icons/facebook.svg" alt="facebook" /></a>
          <p>Facebook</p>
        </div>
      </div>
    </div>
  );
}
