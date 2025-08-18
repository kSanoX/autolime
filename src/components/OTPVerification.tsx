import { useState, useRef } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function OTPVerification({
  tempCode,
  onSuccess,
}: {
  tempCode: number;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [errorCode, setErrorCode] = useState<"none" | "invalid">("none");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorCode("none");

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    setIsLoading(true);
  
    try {
      const res = await fetch(`${API_URL}/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_code: tempCode, code }),
      });
  
      const data = await res.json();
  
      if (data.success && data.access_token) {
        localStorage.setItem("access_token", data.access_token);  
        onSuccess();
      } else {
        setErrorCode("invalid");
      }
    } catch (err) {
      console.error("Ошибка верификации:", err);
      setErrorCode("invalid");
    } finally {
      setIsLoading(false);
    }
  };
  

  const allDigitsFilled = otp.every((digit) => /^\d$/.test(digit));
  const buttonIsActive = allDigitsFilled && !isLoading;

  return (
    <div className="otp-wrapper">
      <h2>We sent a verification code to your phone number. Please enter to verify.</h2>

      {errorCode === "invalid" && (
        <div className="incorrect-code-error">
          <p>Code is not valid</p>
        </div>
      )}

      <div className="input-otp-group">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder="-"
            className={`input-otp-slot ${digit ? "filled" : ""} ${errorCode === "invalid" ? "error" : ""}`}
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={!buttonIsActive}
        className={`send-button ${buttonIsActive ? "active" : ""}`}
      >
        {isLoading ? <span className="spinner" /> : "Send"}
      </button>

      <div className="send-code-again">
        <p>
          Didn't get the code? <a href="#">Send again</a>
        </p>
      </div>
    </div>
  );
}
