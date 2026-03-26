import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "@/hooks/useTranslation";
import type { RootState } from "@/store";
import Sidebar from "@/components/ui/Sidebar";
import ShopAsyncLoader from "@/components/ui/ShopAsyncLoader";
import burgerIcon from "/icons/b-menu.svg";
import discountIcon from "@/assets/icons/discount_icon.svg";
import ticketIcon from "@/assets/icons/ticket_icon.svg";
import ticketYellow from "@/assets/images/shop/ticket_yellow.svg";
import rightArrow from "@/assets/icons/right-arrow.svg";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";
import voucher1 from "@/assets/images/shop/voucher_1.png";
import voucher2 from "@/assets/images/shop/voucher_2.png";
import voucher3 from "@/assets/images/shop/voucher_3.png";
import ticket1 from "@/assets/images/shop/ticket_1.png";
import ticket2 from "@/assets/images/shop/ticket_2.png";
import ticket3 from "@/assets/images/shop/ticket_3.png";
import { fetchTickets, fetchVouchers, type ShopTicket, type ShopVoucher } from "@/lib/shopApi";

const V_FALLBACK = [voucher1, voucher2, voucher3];
const T_FALLBACK = [ticket1, ticket2, ticket3];

function patchVoucherImgs(list: ShopVoucher[]): ShopVoucher[] {
  return list.map((v, i) => ({
    ...v,
    img: v.img || V_FALLBACK[i % V_FALLBACK.length],
  }));
}

function patchTicketImgs(list: ShopTicket[]): ShopTicket[] {
  return list.map((t, i) => ({
    ...t,
    img: t.img || T_FALLBACK[i % T_FALLBACK.length],
  }));
}

export default function ShopPage() {
  const navigate = useNavigate();
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const points = useSelector((s: RootState) => s.user.data?.points);
  const [vouchers, setVouchers] = useState<ShopVoucher[]>([]);
  const [tickets, setTickets] = useState<ShopTicket[]>([]);
  const [listStatus, setListStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchVouchers(), fetchTickets()])
      .then(([vList, tList]) => {
        if (cancelled) return;
        setVouchers(patchVoucherImgs(vList));
        setTickets(patchTicketImgs(tList));
        setListStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setListStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = listStatus === "loading";
  const error = listStatus === "error";

  return (
    <div className="shop-page">
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      <header className="shop-header">
        <button className="shop-header__burger" onClick={() => setSidebarOpen(true)}>
          <img src={burgerIcon} alt="menu" width="20" height="18" />
        </button>
        <span className="shop-header__title">{t("Shop.header.title")}</span>
        <span className="shop-header__spacer" />
      </header>

      <div className="shop-wrapper">
        {/* Balance Card */}
        <div className="shop-balance">
          <div className="shop-balance__left">
            <div className="shop-balance__coin">
              <img src={geocoinIcon} alt="coin" />
            </div>
            <span className="shop-balance__label">{t("Shop.balance.label")}</span>
          </div>
          <div className="shop-balance__right">
            <span className="shop-balance__amount">
              {typeof points === "number" ? points.toLocaleString() : "—"}
            </span>
            <span className="shop-balance__unit">{t("Shop.balance.unit")}</span>
          </div>
        </div>

        {/* Category Cards */}
        <div className="shop-categories">
          <div className="shop-category" onClick={() => navigate("/shop/discounts")}>
            <div className="shop-category__left">
              <div className="shop-category__icon-wrap">
                <img src={discountIcon} alt="discounts" />
              </div>
              <span className="shop-category__label">{t("Shop.categories.discounts")}</span>
            </div>
            <img src={rightArrow} alt="" className="shop-category__arrow" />
          </div>
          <div className="shop-category" onClick={() => navigate("/shop/giveaway")}>
            <div className="shop-category__left">
              <div className="shop-category__icon-wrap">
                <img src={ticketIcon} alt="giveaway" />
              </div>
              <span className="shop-category__label">{t("Shop.categories.giveaway")}</span>
            </div>
            <img src={rightArrow} alt="" className="shop-category__arrow" />
          </div>
        </div>

        {error && <p className="shop-async-error">{t("Shop.loadError")}</p>}

        {/* My Vouchers */}
        <section className="shop-section">
          <div className="shop-section__header">
            <h2 className="shop-section__title">{t("Shop.vouchers.title")}</h2>
            <button className="shop-section__all" onClick={() => navigate("/my-area")}>
              {t("Shop.all")}
              <img src={rightArrow} alt="" />
            </button>
          </div>
          <div className="shop-scroll">
            {loading ? (
              <ShopAsyncLoader />
            ) : error ? null : vouchers.length === 0 ? (
              <p className="shop-async-empty">{t("Shop.vouchers.empty")}</p>
            ) : (
              vouchers.map((v) => (
                <div
                  key={v.id}
                  className="voucher-card"
                  onClick={() =>
                    navigate(`/shop/discounts/${v.id}`, {
                      state: {
                        id: v.id,
                        title: v.title,
                        subtitle: v.category,
                        discount: v.discount,
                        coins: v.coins,
                        img: v.img,
                      },
                    })
                  }
                >
                  <img src={v.img} alt={v.title} className="voucher-card__img" />
                  <div className="voucher-card__body">
                    <p className="voucher-card__title">{v.title}</p>
                    <div className="voucher-card__bottom">
                      <span className="voucher-card__category">{v.category}</span>
                      <div className="voucher-card__value">
                        <span>{v.discount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {!loading && !error && (
              <div className="shop-more-card shop-more-card--shop" onClick={() => navigate("/shop/discounts")}>
                <div className="shop-more-card__plus">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="#183D69" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="shop-more-card__label">
                  <span>{t("Shop.vouchers.buyMore")}</span>
                  <img src={discountIcon} alt="" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* My Tickets */}
        <section className="shop-section">
          <div className="shop-section__header">
            <h2 className="shop-section__title">{t("Shop.tickets.title")}</h2>
            <button className="shop-section__all" onClick={() => navigate("/my-area")}>
              {t("Shop.all")}
              <img src={rightArrow} alt="" />
            </button>
          </div>
          <div className="shop-scroll">
            {loading ? (
              <ShopAsyncLoader />
            ) : error ? null : tickets.length === 0 ? (
              <p className="shop-async-empty">{t("Shop.tickets.empty")}</p>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-card"
                  onClick={() =>
                    navigate(`/shop/giveaway/${ticket.id}`, {
                      state: {
                        id: ticket.id,
                        img: ticket.img,
                        title: ticket.title,
                        daysLeft: ticket.daysLeft,
                        ticketCost: ticket.ticketCost,
                        coinPrice: ticket.coinPrice,
                      },
                    })
                  }
                >
                  <img src={ticket.img} alt={ticket.title} className="ticket-card__img" />
                  <div className="ticket-card__body">
                    <p className="ticket-card__title">{ticket.title}</p>
                    <div className="ticket-card__bottom">
                      <span className="ticket-card__days">{ticket.daysLeft} {t("Shop.tickets.daysLeft")}</span>
                      <div className="ticket-card__coins">
                        <img src={ticketYellow} alt="ticket" />
                        <span>{ticket.ticketCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {!loading && !error && (
              <div className="shop-more-card shop-more-card--ticket shop-more-card--shop" onClick={() => navigate("/shop/giveaway")}>
                <div className="shop-more-card__inner">
                  <div className="shop-more-card__plus">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="#183D69" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="shop-more-card__label">
                    <span>{t("Shop.tickets.join")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
