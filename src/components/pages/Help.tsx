import React, { useState } from "react";
import "../../styles/help.scss";
import arrowHelp from "../../assets/icons/left-arrow.svg";
import { useNavigate } from "react-router-dom";

const helpData = [
  {
    question: "What services do you offer?",
    answer:
      "No appointment is necessary for regular washes, but we recommend booking in advance for detailing and premium services.",
  },
  {
    question: "Where are your car wash locations?",
    answer:
      "No appointment is necessary for regular washes, but we recommend booking in advance for detailing and premium services.",
  },
  {
    question: "Do I need to book an appointment?",
    answer:
      "No appointment is necessary for regular washes, but we recommend booking in advance for detailing and premium services.",
  },
  {
    question: "How long does a car wash take?",
    answer:
      "No appointment is necessary for regular washes, but we recommend booking in advance for detailing and premium services.",
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navigate = useNavigate();

  return (
    <div>
      <header>
        <img onClick={()=> navigate(-1)} src={arrowHelp} alt="" />
        Help
        <span></span>
      </header>

      <div className="help-wrapper">
        {helpData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="help-item" onClick={() => toggle(index)}>
              <div className="help-question">
                <p>{item.question}</p>
                <img
                  src={arrowHelp}
                  alt="toggle"
                  className={`arrow-icon ${isOpen ? "open" : ""}`}
                />
              </div>
              <div className={`help-answer ${isOpen ? "expanded" : ""}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
