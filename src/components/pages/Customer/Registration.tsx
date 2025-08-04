import React, { useState } from "react";
import OTPVerification from "../../OTPVerification";
import { Link } from "react-router-dom";

export default function Registration() {
  const [phoneDigits, setPhoneDigits] = useState("");
  const [error, setError] = useState<{ phone?: string }>({});
  const [stage, setStage] = useState<"register" | "verify">("register");

  const formatPhoneDigits = (raw: string): string => {
    const onlyDigits = raw.replace(/\D/g, "").slice(0, 9);
    const grouped = onlyDigits.match(/.{1,3}/g) || [];
    return grouped.join(" ");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhoneDigits(formatPhoneDigits(e.target.value));
    if (error.phone) setError((prev) => ({ ...prev, phone: undefined }));
  };

  const handleRegister = (): void => {
    const trimmedPhone = phoneDigits.replace(/\D/g, "");
    const fullPhone = "+995" + trimmedPhone;
    const existingNumbers = ["+995123456789", "+995555666777"];

    if (trimmedPhone.length !== 9) {
      setError({ phone: "invalid-length" });
    } else if (existingNumbers.includes(fullPhone)) {
      setError({ phone: "duplicate" });
    } else {
      setError({});
      setStage("verify");
    }
  };

  if (stage === "verify") {
    return <OTPVerification/>;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-logo-block">
        <img src="../../../src/assets/logo.svg" alt="LOGO" />
      </div>

      <div className="auth-greetings">
        <h1>Create account</h1>
        <p>Please enter your phone number <br /> to registration</p>
      </div>

      {error.phone === "duplicate" && (
        <div className="phone-number-doesnt-exist-error">
          <p>Phone number already exists</p>
        </div>
      )}
      {error.phone === "invalid-length" && (
        <div className="phone-number-doesnt-exist-error">
          <p>Phone number must be 9 digits</p>
        </div>
      )}

      <div className="auth-input-block">
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
