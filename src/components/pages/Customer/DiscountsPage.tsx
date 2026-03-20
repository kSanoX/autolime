import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";
import discountImg from "@/assets/images/discounts/discount_img.png";

const CATEGORIES = ["All", "Auto", "Health", "Food", "Rest", "Booking"];

type DiscountCard = {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  discount: string;
  coins: number;
  category: string;
};

const MOCK_DISCOUNTS: DiscountCard[] = [
  { id: 1,  img: discountImg, title: "TBC Insurance",                     subtitle: "Car Insurance",             discount: "-15%", coins: 150,   category: "Auto"   },
  { id: 2,  img: discountImg, title: "Wissol",                            subtitle: "Car parts and accessories", discount: "-15%", coins: 120,   category: "Auto"   },
  { id: 3,  img: discountImg, title: "TBC Insurance",                     subtitle: "Car Insurance",             discount: "-15%", coins: 90,    category: "Auto"   },
  { id: 4,  img: discountImg, title: "NGHS",                              subtitle: "Medical examination",       discount: "-20%", coins: 700,   category: "Health" },
  { id: 5,  img: discountImg, title: "Southeast Georgia Health System",   subtitle: "Medical tests",             discount: "-40%", coins: 1400,  category: "Health" },
  { id: 6,  img: discountImg, title: "Southeast Georgia Health System",   subtitle: "Medical tests",             discount: "-15%", coins: 560,   category: "Health" },
];

export default function DiscountsPage() {
  const navigate = useNavigate();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const points = useSelector((s: RootState) => s.user.data?.points);

  const visibleCategories = activeTab === "All"
    ? [...new Set(MOCK_DISCOUNTS.map((d) => d.category))]
    : [activeTab];

  const filtered = (category: string) =>
    MOCK_DISCOUNTS.filter(
      (d) =>
        d.category === category &&
        (search === "" || d.title.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="discounts-page">
      {/* Header */}
      <header className="discounts-header">
        <button className="discounts-header__back" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#183D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="discounts-header__title">{t("Discounts.title")}</span>
        <div className="discounts-header__balance">
          <img src={geocoinIcon} alt="coin" className="discounts-header__coin" />
          <span className="discounts-header__amount">
            {typeof points === "number" ? points.toLocaleString() : "—"}
          </span>
        </div>
      </header>

      <div className="discounts-wrapper">
        {/* Search */}
        <div className="discounts-search">
          <input
            className="discounts-search__input"
            placeholder={t("Discounts.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="discounts-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#879AB1" strokeWidth="1.5"/>
            <path d="M11 11l2.5 2.5" stroke="#879AB1" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Category tabs */}
        <div className="discounts-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`discounts-tab${activeTab === cat ? " discounts-tab--active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sections */}
        {visibleCategories.map((cat) => {
          const cards = filtered(cat);
          if (cards.length === 0) return null;
          return (
            <section key={cat} className="discounts-section">
              <h2 className="discounts-section__title">{cat}</h2>
              <div className="discounts-grid">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="discount-card"
                    onClick={() => navigate(`/shop/discounts/${card.id}`, {
                      state: {
                        title: card.title,
                        subtitle: card.subtitle,
                        discount: card.discount,
                        coins: card.coins,
                        img: card.img,
                      },
                    })}
                  >
                    <img src={card.img} alt={card.title} className="discount-card__img" />
                    <div className="discount-card__body">
                      <div className="discount-card__text">
                        <p className="discount-card__title">{card.title}</p>
                        <p className="discount-card__subtitle">{card.subtitle}</p>
                      </div>
                      <div className="discount-card__footer">
                        <span className="discount-card__badge">{card.discount}</span>
                        <div className="discount-card__price">
                          <img src={geocoinIcon} alt="coin" className="discount-card__price-coin" />
                          <span>{card.coins!.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
