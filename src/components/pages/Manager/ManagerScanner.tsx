// components/ManagerScanner/index.tsx
import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect } from "react";
import "../../../styles/manager-scanner.scss"
import { useDispatch } from "react-redux";
import { setScannedPlate } from "@/store/plateSlice";

export default function ManagerScanner(): React.JSX.Element {
    const dispatch = useDispatch();
  
    useEffect(() => {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
      }, false);
  
      scanner.render(
        (decodedText: string) => {
          console.log("✅ Scanned:", decodedText);
          dispatch(setScannedPlate(decodedText));
        },
        (error: string) => {
          console.warn("❌ Scan error:", error);
        }
      );
  
      return () => {
        scanner.clear().catch((e: Error) => console.error("Clear error:", e));
      };
    }, []);
  
    return (
      <div className="scanner-wrapper">
        <div id="qr-reader" className="scanner-box" />
      </div>
    );
  }
