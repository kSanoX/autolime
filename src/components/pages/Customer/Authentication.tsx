import React, { useState } from "react";

export default function Authentication() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [error, setError] = useState<{ phone?: string; password?: string }>({});

  const togglePassword = () => setShowPassword((prev) => !prev);

  const formatPhoneDigits = (raw: string): string => {
    const onlyDigits = raw.replace(/\D/g, "").slice(0, 9);
    const grouped = onlyDigits.match(/.{1,3}/g) || [];
    return grouped.join(" ");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhoneDigits(formatPhoneDigits(e.target.value));
    if (error.phone) setError((prev) => ({ ...prev, phone: undefined }));
  };

  const handleLogin = (): void => {
    const trimmedPhone = phoneDigits.replace(/\D/g, "");
    const fullPhone = "+995" + trimmedPhone;
  
    const fakeUser = {
      phone: "+995123456789",
      password: "demo123",
    };
  
    let phoneCode: "not-found" | undefined;
    let passwordCode: "incorrect" | undefined;
  
    if (trimmedPhone.length !== 9 || fullPhone !== fakeUser.phone) {
      phoneCode = "not-found";
    }
  
    if (!password.trim() || password !== fakeUser.password) {
      passwordCode = "incorrect";
    }
  
    if (phoneCode || passwordCode) {
      setError({ phone: phoneCode, password: passwordCode });
    } else {
      setError({});
      alert("Login successful!");
    }
  };  

  return (
    <div className="auth-wrapper">
      <div className="auth-logo-block">
        <img src="../../../src/assets/logo.svg" alt="LOGO" />
      </div>

      <div className="auth-greetings">
        <h1>Welcome</h1>
        <p>Enter your phone number and password to access your account</p>
      </div>
      {error.phone === "not-found" && (
  <div className="phone-number-doesnt-exist-error">
    <p>Phone number doesn't exist</p>
  </div>
)}

{error.password === "incorrect" && (
  <div className="incorrect-password-error">
    <p>Password is incorrect</p>
  </div>
)}
      <div className="auth-input-block">
        {/* PHONE */}
        <div className="auth-phone-input">
          <label>Phone number</label>
          <div className="input-with-prefix">
            <span className="phone-prefix">+995</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phoneDigits}
              onChange={handlePhoneChange}
              maxLength={11}
              placeholder="XXX XXX XXX"
              className="custom-input"
            />
          </div>
        </div>

        {/* PASSWORD */}
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
              placeholder="Input your password"
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

        {/* Forgot */}
        <div className="forgot-password">
          <a href="/forgot">Forgot password?</a>
        </div>

        {/* Submit */}
        <div className="sign-in">
          <button onClick={handleLogin}>Sign In</button>
        </div>
      </div>
      <div className="sign-up-navigate">
        <p>Dont have an account? <a href="/">Sign Up</a></p>
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
        <a href="/"><img src="../../../src/assets/icons/facebook.svg" alt="facebook"/></a>
        <p>Facebook</p>
        </div>
      </div>
    </div>
  );
}
