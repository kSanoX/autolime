import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import leftArrow from "@/assets/icons/left-arrow.svg";

import discountIcon from "@/assets/icons/discount_icon.svg";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";
import discountImg from "@/assets/images/discounts/discount_img.png";
import ticketYellow from "@/assets/images/shop/ticket_yellow.svg";
import ticket1 from "@/assets/images/shop/ticket_1.png";
import ShopAsyncLoader from "@/components/ui/ShopAsyncLoader";
import { fetchMyTickets, fetchMyVouchers, formatVoucherCodeDisplay } from "@/lib/shopApi";

export default function MyAreaPage() {
  const navigate = useNavigate();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<"vouchers" | "tickets">("vouchers");
  const points = useSelector((s: RootState) => s.user.data?.points);
  const [myVouchers, setMyVouchers] = useState<Awaited<ReturnType<typeof fetchMyVouchers>>>([]);
  const [myTickets, setMyTickets] = useState<Awaited<ReturnType<typeof fetchMyTickets>>>([]);
  const [listStatus, setListStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchMyVouchers(), fetchMyTickets()])
      .then(([v, tick]) => {
        if (cancelled) return;
        setMyVouchers(v);
        setMyTickets(tick);
        setListStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setListStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sections = useMemo(() => {
    const loading = listStatus === "loading";
    const error = listStatus === "error";

    return {
      vouchers: (
        <section className="shop-section">
          <div
            className={
              !loading && !error && myVouchers.length > 0
                ? "shop-scroll shop-scroll--my-area shop-scroll--my-area-full"
                : "shop-scroll shop-scroll--my-area"
            }
          >
            {loading ? (
              <ShopAsyncLoader />
            ) : error ? (
              <p className="shop-async-error">{t("Shop.loadError")}</p>
            ) : (
              <Fragment>
                {myVouchers.map((v) => (
                  <div
                    key={`${v.id}-${v.voucherId}`}
                    className="voucher-card voucher-card--my-area"
                    onClick={() =>
                      navigate(`/shop/discounts/${v.voucherId}`, {
                        state: {
                          fromMyArea: true,
                          id: v.voucherId,
                          title: v.title,
                          subtitle: "",
                          discount: v.discount ?? "",
                          coins: 0,
                          img: v.img || discountImg,
                          code: v.code ?? undefined,
                        },
                      })
                    }
                  >
                    <img src={v.img || discountImg} alt={v.title} className="voucher-card__img" />
                    <div className="voucher-card__body">
                      <p className="voucher-card__title">{v.title}</p>
                      {v.code ? (
                        <div className="voucher-card__bottom">
                          <span className="voucher-card__category">{formatVoucherCodeDisplay(v.code)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
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
              </Fragment>
            )}
          </div>
        </section>
      ),

      tickets: (
        <section className="shop-section">
          <div
            className={
              !loading && !error && myTickets.length > 0
                ? "shop-scroll shop-scroll--my-area shop-scroll--my-area-full"
                : "shop-scroll shop-scroll--my-area"
            }
          >
            {loading ? (
              <ShopAsyncLoader />
            ) : error ? (
              <p className="shop-async-error">{t("Shop.loadError")}</p>
            ) : (
              <Fragment>
                {myTickets.map((row) => (
                  <div
                    key={`${row.id}-${row.ticketId}`}
                    className="ticket-card ticket-card--my-area"
                    onClick={() =>
                      navigate(`/shop/giveaway/${row.ticketId}`, {
                        state: {
                          id: row.ticketId,
                          img: row.img || ticket1,
                          title: row.title,
                          daysLeft: 0,
                          ticketCost: row.qty,
                          coinPrice: 0,
                        },
                      })
                    }
                  >
                    <img src={row.img || ticket1} alt={row.title} className="ticket-card__img" />
                    <div className="ticket-card__body">
                      <p className="ticket-card__title">{row.title}</p>
                      <div className="ticket-card__bottom">
                        <span className="ticket-card__days">{row.qty} tickets</span>
                        <div className="ticket-card__coins">
                          <img src={ticketYellow} alt="ticket" />
                          <span>{row.qty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
              </Fragment>
            )}
          </div>
        </section>
      ),
    };
  }, [listStatus, myTickets, myVouchers, navigate, t]);

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

