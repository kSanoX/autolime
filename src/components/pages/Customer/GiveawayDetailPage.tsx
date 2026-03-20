import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";
import ticketYellow from "@/assets/images/shop/ticket_yellow.svg";
import { buyPointsAndRedirect } from "@/lib/buyPoints";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { GiveawayItem } from "./GiveawayPage";
import { MOCK_GIVEAWAYS } from "./GiveawayPage";

type SheetState = "closed" | "confirm" | "buy_points" | "buy_loading" | "buy_success";

export default function GiveawayDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  const passed = location.state as GiveawayItem | null;
  const item: GiveawayItem = passed ?? MOCK_GIVEAWAYS[0];

  const [sheet, setSheet] = useState<SheetState>("closed");
  const [qty, setQty] = useState(1);
  const [pointsInput, setPointsInput] = useState("");
  const userPoints = useSelector((s: RootState) => s.user.data?.points);
  const [balance, setBalance] = useState(0);
  const [myTickets, setMyTickets] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(false);

  const totalCost = item.coinPrice * qty;
  const newBalance = balance - totalCost;
  const isNegative = newBalance < 0;
  const shortage = Math.abs(newBalance);
  const handleTake = () => {
    setSheet("closed");
    setMyTickets((t) => t + qty);
    setBannerVisible(true);
    setTimeout(() => setBannerVisible(false), 3000);
  };

  const handleBuy = () => {
    const amount = parseInt(pointsInput || String(shortage), 10) || shortage;
    if (!Number.isFinite(amount) || amount <= 0) return;

    // Save pending marker if we come back to the same place.
    sessionStorage.setItem("pending_points_buy_amount", String(amount));
    const returnTo = window.location.pathname + window.location.search;

    setSheet("buy_loading");
    buyPointsAndRedirect(amount, returnTo).catch((e) => {
      console.error(e);
      setSheet("buy_points");
    });
  };

  const openSheet = () => {
    setQty(1);
    setPointsInput("");
    setSheet("confirm");
  };

  const closeSheet = () => setSheet("closed");
  const goBack = () => setSheet("confirm");

  useEffect(() => {
    if (sheet !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sheet]);

  useEffect(() => {
    if (typeof userPoints === "number") {
      setBalance(userPoints);
    }
  }, [userPoints]);

  return (
    <div className="giveaway-detail">
      {/* Hero */}
      <div className="giveaway-detail__hero">
        <img src={item.img} alt={item.title} />
        <div className="giveaway-detail__appbar">
          <button className="giveaway-detail__back" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#183D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="giveaway-detail__balance">
            <img src={geocoinIcon} alt="coin" />
            <span>{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="giveaway-detail__body">

        <AnimatePresence>
          {bannerVisible && (
            <motion.div
              className="giveaway-detail__banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {`Purchased successfully. You got ${myTickets} ticket${myTickets !== 1 ? "s" : ""}`}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="giveaway-detail__price-row">
          <span className="giveaway-detail__days-badge">
            {item.daysLeft} {t("Giveaway.daysLeft")}
          </span>
          {myTickets > 0 && (
            <div className="giveaway-detail__my-ticket-badge">
              <img src={ticketYellow} alt="ticket" />
              <span>{myTickets}</span>
            </div>
          )}
          <div className="giveaway-detail__coin-badge">
            <img src={geocoinIcon} alt="coin" />
            <span>{item.coinPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="giveaway-detail__info">
          <h1 className="giveaway-detail__title">{item.title}</h1>
          <p className="giveaway-detail__desc">
            Every extra lottery ticket is a real increase in your odds of winning. Multiply your opportunities and make this draw yours!
          </p>
        </div>

        <button className="giveaway-detail__join-btn" onClick={openSheet}>
          {t("Giveaway.takePartBtn")}
        </button>

        <div className="giveaway-detail__terms">
          <p className="giveaway-detail__terms-heading">{t("Giveaway.termsTitle")}</p>
          <p className="giveaway-detail__terms-line">
            Take part in the giveaway of prizes from <strong>GeoCar</strong>!
          </p>
          <p className="giveaway-detail__terms-subheading">Prizes for participants:</p>
          <p className="giveaway-detail__terms-line">– 15 stylish hoodies</p>
          <p className="giveaway-detail__terms-subheading">How to join:</p>
          <ul className="giveaway-detail__terms-list">
            <li>deduct {item.coinPrice} points in the app — and you're already in the giveaway!</li>
            <li>after deducting points, participation is automatically counted.</li>
          </ul>
        </div>

        <div className="giveaway-detail__draw-banner">
          Main prize drawing — 13.12.2024
        </div>

        <p className="giveaway-detail__results">
          Results — by 20.12.2024 on the official page with details of the promotion and rules:{" "}
          <a href="https://geocar.com/giveaways" className="giveaway-detail__results-link" target="_blank" rel="noreferrer">
            geocar.com/giveaways
          </a>
        </p>

        <div className="giveaway-detail__company">
          <div className="giveaway-detail__company-left">
            <p className="giveaway-detail__company-name">TBC Insurance</p>
            <p className="giveaway-detail__company-contact">Tel: 0322 573451</p>
            <p className="giveaway-detail__company-contact">Web: www.tegeta.ge</p>
          </div>
          <div className="giveaway-detail__company-right">
            <span>Tbilisi</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5Zm0 6.125A1.625 1.625 0 1 1 8 4.25a1.625 1.625 0 0 1 0 3.25Z" fill="#183D69"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {sheet !== "closed" && (
          <motion.div
            className="giveaway-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet */}
      <AnimatePresence>
        {sheet !== "closed" && (
          <motion.div
            className="giveaway-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 600 }}
            dragElastic={0}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) closeSheet();
            }}
          >
            <div className="giveaway-sheet__handle" />

            {/* ── CONFIRM state ── */}
            {sheet === "confirm" && (
              <>
                <h2 className="giveaway-sheet__title">{item.title}</h2>
                <p className="giveaway-sheet__subtitle">
                  Every extra lottery ticket is a real increase in your odds of winning. Multiply your opportunities and make this draw yours!
                </p>

                <div className="giveaway-sheet__ticket-row">
                  <div className="giveaway-sheet__coin-badge">
                    <img src={geocoinIcon} alt="coin" />
                    <span>{item.coinPrice.toLocaleString()}</span>
                  </div>
                  <div className="giveaway-sheet__qty-ctrl">
                    <span className="giveaway-sheet__qty-label">{t("Giveaway.tickets")}</span>
                    <button className="giveaway-sheet__qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14" stroke={qty <= 1 ? "#879AB1" : "#183D69"} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <input
                      className="giveaway-sheet__qty-input"
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 1) setQty(v);
                      }}
                    />
                    <button className="giveaway-sheet__qty-btn" onClick={() => setQty((q) => q + 1)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="#183D69" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="giveaway-sheet__divider" />

                <div className="giveaway-sheet__balances">
                  <div className="giveaway-sheet__balance-row">
                    <span className="giveaway-sheet__balance-label">{t("Giveaway.currentBalance")}</span>
                    <div className="giveaway-sheet__balance-value">
                      <span>{balance.toLocaleString()}</span>
                      <span className="giveaway-sheet__balance-unit">{t("Giveaway.points")}</span>
                    </div>
                  </div>
                  <div className="giveaway-sheet__balance-row">
                    <span className="giveaway-sheet__balance-label">{t("Giveaway.newBalance")}</span>
                    <div className={`giveaway-sheet__balance-value${isNegative ? " giveaway-sheet__balance-value--negative" : " giveaway-sheet__balance-value--new"}`}>
                      <span>{newBalance.toLocaleString()}</span>
                      <span className="giveaway-sheet__balance-unit">{t("Giveaway.points")}</span>
                    </div>
                  </div>
                </div>

                {isNegative ? (
                  <button className="giveaway-sheet__confirm-btn" onClick={() => { setPointsInput(String(shortage)); setSheet("buy_points"); }}>
                    {t("Giveaway.buyMorePointsBtn")}
                  </button>
                ) : (
                  <button className="giveaway-sheet__confirm-btn" onClick={handleTake}>
                    {t("Giveaway.takeBtn")}
                  </button>
                )}
              </>
            )}

            {/* ── BUY POINTS state ── */}
            {(sheet === "buy_points" || sheet === "buy_loading") && (
              <>
                <div className="giveaway-sheet__sub-header">
                  <button className="giveaway-sheet__sub-back" onClick={goBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18l-6-6 6-6" stroke="#183D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <h2 className="giveaway-sheet__title">{t("Giveaway.notEnoughTitle")}</h2>
                </div>
                <p className="giveaway-sheet__subtitle">
                  {`You are ${shortage} points short. Purchase them now.`}
                </p>

                <div className="giveaway-sheet__input-row">
                  <input
                    className="giveaway-sheet__input"
                    type="number"
                    value={pointsInput}
                    onChange={(e) => setPointsInput(e.target.value)}
                    placeholder="0"
                  />
                  <span className="giveaway-sheet__input-unit">{t("Giveaway.points")}</span>
                </div>

                <div className="giveaway-sheet__amount-row">
                  <span className="giveaway-sheet__amount-label">{t("Giveaway.amountToPay")}</span>
                  <span className="giveaway-sheet__amount-value">£ {pointsInput || shortage}</span>
                </div>

                <button
                  className="giveaway-sheet__confirm-btn"
                  onClick={handleBuy}
                  disabled={sheet === "buy_loading"}
                >
                  {sheet === "buy_loading" ? (
                    <span className="giveaway-sheet__spinner" />
                  ) : (
                    t("Giveaway.buyBtn")
                  )}
                </button>
              </>
            )}

            {/* ── SUCCESS state ── */}
            {sheet === "buy_success" && (
              <>
                <div className="giveaway-sheet__sub-header">
                  <button className="giveaway-sheet__sub-back" onClick={goBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18l-6-6 6-6" stroke="#183D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <h2 className="giveaway-sheet__title giveaway-sheet__title--success">{t("Giveaway.successTitle")}</h2>
                </div>
                <p className="giveaway-sheet__subtitle">
                  {`You have successfully purchased ${pointsInput || shortage} points.`}
                </p>
                <div className="giveaway-sheet__balance-row">
                  <span className="giveaway-sheet__balance-label">{t("Giveaway.currentBalance")}</span>
                  <div className="giveaway-sheet__balance-value giveaway-sheet__balance-value--new">
                    <span>{balance.toLocaleString()}</span>
                    <span className="giveaway-sheet__balance-unit">{t("Giveaway.points")}</span>
                  </div>
                </div>
                <button className="giveaway-sheet__confirm-btn" onClick={goBack}>
                  {t("Giveaway.okBtn")}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
