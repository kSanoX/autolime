import { useNavigate } from "react-router-dom";
import { leftArrowUrl } from "@/assets/staticUrls";

export default function Messages() {
  const navigate = useNavigate();
  return (
    <div>
      <header>
        <img onClick={()=> navigate(-1)} src={leftArrowUrl} alt='' />
        Messages
        <span></span>
      </header>
      <div style={{ margin: "16px", padding: "16px", borderRadius: "16px", boxShadow: "2px 2px 2px 2px rgba(143, 143, 143, 0.1)" }}>
        <h4 style={{color: "#F7B233", fontWeight: "600", marginBottom: "8px"}}>June 2023  17:00</h4>
        <p style={{color: "#183D69"}}>Thank you for visiting! We appreciate your feedback. Please leave a review of our service</p>
      </div>
    </div>
  );
}
