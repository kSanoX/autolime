import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import leftArrow from "@/assets/icons/left-arrow.svg";

import discountIcon from "@/assets/icons/discount_icon.svg";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";

export default function MyAreaPage() {
  const navigate = useNavigate();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<"vouchers" | "tickets">("vouchers");
  const points = useSelector((s: RootState) => s.user.data?.points);

  const sections = useMemo(() => {
    return {
      vouchers: (
        <section className="shop-section">
          <div className="shop-scroll">
            <div className="shop-more-card shop-more-card--my-area" onClick={() => navigate("/shop/discounts")}>
              <div className="shop-more-card__plus">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#183D69" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="shop-more-card__label">
                <span>{t("Shop.vouchers.buyMore")}</span>
                <img src={discountIcon} alt="" />
              </div>
            </div>
          </div>
        </section>
      ),

      tickets: (
        <section className="shop-section">
          <div className="shop-scroll">
            <div className="shop-more-card shop-more-card--my-area" onClick={() => navigate("/shop/giveaway")}>
              <div className="shop-more-card__plus">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="#183D69"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="shop-more-card__label">
                <span>{t("Shop.tickets.join")}</span>
              </div>
            </div>
          </div>
        </section>
      ),
    };
  }, [navigate, t]);

  return (
    <div className="my-area-page">
      <header className="my-area-topbar">
        <button className="my-area-topbar__back" onClick={() => navigate(-1)} aria-label="Back">
          <img src={leftArrow} alt="Back" />
        </button>
        <span className="my-area-topbar__title">My Area</span>
        <div className="my-area-topbar__balance">
          <div className="my-area-topbar__coin">
            <img src={geocoinIcon} alt="coin" />
          </div>
          <div className="my-area-topbar__balance-text">
            <span className="my-area-topbar__amount">
              {typeof points === "number" ? points.toLocaleString() : "—"}
            </span>
          </div>
        </div>
      </header>

      <div className="my-area-wrapper">
        <div className="my-area-tabs">
          <button
            className={`my-area-tab${activeTab === "vouchers" ? " my-area-tab--active" : ""}`}
            onClick={() => setActiveTab("vouchers")}
          >
            {t("Shop.vouchers.title")}
          </button>
          <button
            className={`my-area-tab${activeTab === "tickets" ? " my-area-tab--active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            {t("Shop.tickets.title")}
          </button>
        </div>

        {activeTab === "vouchers" ? sections.vouchers : sections.tickets}
      </div>
    </div>
  );
}

