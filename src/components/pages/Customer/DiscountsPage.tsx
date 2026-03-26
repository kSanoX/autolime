import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import geocoinIcon from "@/assets/images/shop/geocoin_icon.png";
import discountImg from "@/assets/images/discounts/discount_img.png";
import ShopAsyncLoader from "@/components/ui/ShopAsyncLoader";
import { fetchVouchers, type ShopVoucher } from "@/lib/shopApi";

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

function shopToCard(v: ShopVoucher, fallbackImg: string): DiscountCard {
  return {
    id: v.id,
    img: v.img || fallbackImg,
    title: v.title,
    subtitle: v.category,
    discount: v.discount,
    coins: v.coins,
    category: v.category || "Auto",
  };
}

export default function DiscountsPage() {
  const navigate = useNavigate();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const points = useSelector((s: RootState) => s.user.data?.points);
  const [cards, setCards] = useState<DiscountCard[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    void fetchVouchers()
      .then((list) => {
        if (cancelled) return;
        setCards(list.map((v) => shopToCard(v, discountImg)));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCategories = activeTab === "All"
    ? [...new Set(cards.map((d) => d.category))]
    : [activeTab];

  const filtered = (category: string) =>
    cards.filter(
      (d) =>
        d.category === category &&
        (search === "" || d.title.toLowerCase().includes(search.toLowerCase())),
    );

  const loading = status === "loading";
  const error = status === "error";

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
            disabled={loading || error}
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
              type="button"
              className={`discounts-tab${activeTab === cat ? " discounts-tab--active" : ""}`}
              onClick={() => setActiveTab(cat)}
              disabled={loading || error}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <ShopAsyncLoader />
        ) : error ? (
          <p className="shop-async-error">{t("Shop.loadError")}</p>
        ) : (
          visibleCategories.map((cat) => {
            const sectionCards = filtered(cat);
            if (sectionCards.length === 0) return null;
            return (
              <section key={cat} className="discounts-section">
                <h2 className="discounts-section__title">{cat}</h2>
                <div className="discounts-grid">
                  {sectionCards.map((card) => (
                    <div
                      key={card.id}
                      className="discount-card"
                      onClick={() => navigate(`/shop/discounts/${card.id}`, {
                        state: {
                          id: card.id,
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
          })
        )}

        {!loading && !error && cards.length === 0 && (
          <p className="shop-async-empty">{t("Discounts.empty")}</p>
        )}
      </div>
    </div>
  );
}
