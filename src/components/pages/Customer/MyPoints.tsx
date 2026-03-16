import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import balanceIcon from "@/assets/icons/balance_icon.svg";
import referralsIcon from "@/assets/icons/referals_icon.svg";
import rightArrow from "@/assets/icons/right-arrow.svg";

type Transaction = {
  date: string;
  time: string;
  description: string;
  points: number;
};

const MOCK_BALANCE = 250;
const MOCK_REFERRALS = 2;
const MOCK_TRANSACTIONS: Transaction[] = [
  { date: "24 June 2023", time: "17:00", description: "Voucher purchase", points: -200 },
  { date: "19 June 2023", time: "17:20", description: "Bank purchase",    points: +300 },
  { date: "13 June 2023", time: "12:00", description: "Referral program", points: +50  },
  { date: "01 June 2023", time: "12:00", description: "Loyalty program",  points: +100 },
];

export default function MyPoints() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  // уведомление после пополнения — принимаем через state от PointsInfo
  const addedPoints: number | null = (location.state as any)?.addedPoints ?? null;
  const [showNotice, setShowNotice] = useState(!!addedPoints);

  useEffect(() => {
    if (!addedPoints) return;
    const timer = setTimeout(() => setShowNotice(false), 5000);
    return () => clearTimeout(timer);
  }, [addedPoints]);

  return (
    <div className="my-points-page">
      <header>
        <img
          onClick={() => navigate(-1)}
          src="../../../src/assets/icons/left-arrow.svg"
          alt="Back"
        />
        {t("MyPoints.header.title")}
        <span />
      </header>

      <div className="my-points-wrapper">
        {/* Balance */}
        <div className="my-points-card" onClick={() => navigate("/my-points/info")}>
          <div className="my-points-card__top">
            <div className="yellow-box">
              <img src={balanceIcon} alt="balance" />
            </div>
            <span className="my-points-card__label">{t("MyPoints.balance.label")}</span>
          </div>

          {showNotice && (
            <div className="my-points-notice">
              {addedPoints} {t("MyPoints.balance.unit")} {t("MyPoints.notice.added")}
            </div>
          )}

          <div className="my-points-card__bottom">
            <p className="my-points-card__value">
              {MOCK_BALANCE}
              <span className="my-points-card__unit">{t("MyPoints.balance.unit")}</span>
            </p>
            <img src={rightArrow} alt="" className="my-points-card__arrow" />
          </div>
        </div>

        {/* Referrals */}
        <div className="my-points-card" onClick={() => navigate("/my-points/referrals")}>
          <div className="my-points-card__top">
            <div className="yellow-box">
              <img src={referralsIcon} alt="referrals" />
            </div>
            <span className="my-points-card__label">{t("MyPoints.referrals.label")}</span>
          </div>
          <div className="my-points-card__bottom">
            <p className="my-points-card__value">
              {MOCK_REFERRALS}
              <span className="my-points-card__unit">{t("MyPoints.referrals.unit")}</span>
            </p>
            <img src={rightArrow} alt="" className="my-points-card__arrow" />
          </div>
        </div>

        {/* Transaction history */}
        <div className="my-points-history">
          <h2 className="my-points-history__title">{t("MyPoints.history.title")}</h2>
          {MOCK_TRANSACTIONS.length === 0 ? (
            <p className="my-points-history__empty">{t("MyPoints.history.empty")}</p>
          ) : (
            <ul className="my-points-history__list">
              {MOCK_TRANSACTIONS.map((tx, i) => (
                <li key={i} className="my-points-history__item">
                  <div className="my-points-history__meta">
                    <span className="my-points-history__date">
                      {tx.date} • {tx.time}
                    </span>
                    <span className="my-points-history__desc">{tx.description}</span>
                  </div>
                  <span className={`my-points-history__points ${tx.points < 0 ? "minus" : "plus"}`}>
                    {tx.points > 0 ? `+ ${tx.points}` : `- ${Math.abs(tx.points)}`} {t("MyPoints.balance.unit")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
