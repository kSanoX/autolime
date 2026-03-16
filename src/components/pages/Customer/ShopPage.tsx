import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import discountIcon from "@/assets/icons/discount_icon.svg";
import starIcon from "@/assets/icons/star_icon.svg";
import rightArrow from "@/assets/icons/right-arrow.svg";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";
import voucher1 from "@/assets/images/shop/voucher_1.png";
import voucher2 from "@/assets/images/shop/voucher_2.png";
import voucher3 from "@/assets/images/shop/voucher_3.png";
import ticket1 from "@/assets/images/shop/ticket_1.png";
import ticket2 from "@/assets/images/shop/ticket_2.png";
import ticket3 from "@/assets/images/shop/ticket_3.png";

const MOCK_BALANCE = 2560;

const MOCK_VOUCHERS = [
  { id: 1, img: voucher1, title: "TBC Insurance", category: "Car Insurance",       discount: "-15%" },
  { id: 2, img: voucher2, title: "Wissol",        category: "Car parts and accessories", discount: "-15%" },
  { id: 3, img: voucher3, title: "TBC Bank",      category: "Car services",        discount: "-15%" },
];

const MOCK_TICKETS = [
  { id: 1, img: ticket1, title: "iPhone 15 Pro Max",    daysLeft: 14,  coins: 2  },
  { id: 2, img: ticket2, title: "2025 Toyota Camry",    daysLeft: 132, coins: 24 },
  { id: 3, img: ticket3, title: "20 liters of gasoline", daysLeft: 7,   coins: 24 },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <div className="shop-page">
      <header className="shop-header">
        <button className="shop-header__burger" onClick={() => {}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#183D69" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="shop-header__title">{t("Shop.header.title")}</span>
        <span />
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
            <span className="shop-balance__amount">{MOCK_BALANCE.toLocaleString()}</span>
            <span className="shop-balance__unit">{t("Shop.balance.unit")}</span>
          </div>
        </div>

        {/* Category Cards */}
        <div className="shop-categories">
          <div className="shop-category" onClick={() => navigate("/shop/discounts")}>
            <div className="shop-category__icon-wrap">
              <img src={discountIcon} alt="discounts" />
            </div>
            <span className="shop-category__label">{t("Shop.categories.discounts")}</span>
            <img src={rightArrow} alt="" className="shop-category__arrow" />
          </div>
          <div className="shop-category" onClick={() => navigate("/shop/giveaway")}>
            <div className="shop-category__icon-wrap">
              <img src={starIcon} alt="giveaway" />
            </div>
            <span className="shop-category__label">{t("Shop.categories.giveaway")}</span>
            <img src={rightArrow} alt="" className="shop-category__arrow" />
          </div>
        </div>

        {/* My Vouchers */}
        <section className="shop-section">
          <div className="shop-section__header">
            <h2 className="shop-section__title">{t("Shop.vouchers.title")}</h2>
            <button className="shop-section__all" onClick={() => navigate("/shop/discounts")}>
              {t("Shop.all")}
              <img src={rightArrow} alt="" />
            </button>
          </div>
          <div className="shop-scroll">
            {MOCK_VOUCHERS.map((v) => (
              <div key={v.id} className="voucher-card">
                <img src={v.img} alt={v.title} className="voucher-card__img" />
                <div className="voucher-card__body">
                  <p className="voucher-card__title">{v.title}</p>
                  <p className="voucher-card__category">{v.category}</p>
                  <span className="voucher-card__badge">{v.discount}</span>
                </div>
              </div>
            ))}
            <div className="shop-scroll__more" onClick={() => navigate("/shop/discounts")}>
              <div className="shop-scroll__plus">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#183D69" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span>{t("Shop.vouchers.buyMore")}</span>
              <img src={discountIcon} alt="" className="shop-scroll__more-icon" />
            </div>
          </div>
        </section>

        {/* My Tickets */}
        <section className="shop-section">
          <div className="shop-section__header">
            <h2 className="shop-section__title">{t("Shop.tickets.title")}</h2>
            <button className="shop-section__all" onClick={() => navigate("/shop/giveaway")}>
              {t("Shop.all")}
              <img src={rightArrow} alt="" />
            </button>
          </div>
          <div className="shop-scroll">
            {MOCK_TICKETS.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <img src={ticket.img} alt={ticket.title} className="ticket-card__img" />
                <div className="ticket-card__body">
                  <p className="ticket-card__title">{ticket.title}</p>
                  <p className="ticket-card__days">{ticket.daysLeft} {t("Shop.tickets.daysLeft")}</p>
                  <div className="ticket-card__coins">
                    <img src={geocoinIcon} alt="coin" />
                    <span>{ticket.coins}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="shop-scroll__more" onClick={() => navigate("/shop/giveaway")}>
              <div className="shop-scroll__plus">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#183D69" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span>{t("Shop.tickets.join")}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
