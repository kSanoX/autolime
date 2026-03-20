import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { customFetch } from "@/utils/customFetch";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import balanceIcon from "@/assets/icons/balance_icon.svg";
import referralsIcon from "@/assets/icons/referals_icon.svg";
import rightArrow from "@/assets/icons/right-arrow.svg";

type Transaction = {
  id: string;
  date: string;
  time: string;
  description: string;
  points: number;
};

const EMPTY_TRANSACTIONS: Transaction[] = [];

type JsonObj = Record<string, unknown>;

const asObj = (v: unknown): JsonObj | null =>
  v && typeof v === "object" ? (v as JsonObj) : null;

const pickNumber = (obj: JsonObj | null, keys: string[]): number | null => {
  if (!obj) return null;
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
};

const pickString = (obj: JsonObj | null, keys: string[]): string | null => {
  if (!obj) return null;
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return null;
};

const formatDateTime = (raw: string): { date: string; time: string } => {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return { date: raw, time: "" };
  const date = parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = parsed.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
};

export default function MyPoints() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();
  const user = useSelector((s: RootState) => s.user.data);

  // уведомление после пополнения — принимаем через state от PointsInfo
  const locationState = asObj(location.state);
  const addedPoints =
    typeof locationState?.addedPoints === "number" ? locationState.addedPoints : null;
  const pendingAmount = (() => {
    const raw = sessionStorage.getItem("pending_points_buy_amount");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  })();

  const effectiveNoticeAmount = addedPoints ?? pendingAmount;
  const [showNotice, setShowNotice] = useState(!!effectiveNoticeAmount);
  const [transactions, setTransactions] = useState<Transaction[]>(EMPTY_TRANSACTIONS);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    if (!effectiveNoticeAmount) return;
    const timer = setTimeout(() => setShowNotice(false), 5000);
    return () => clearTimeout(timer);
  }, [effectiveNoticeAmount]);

  useEffect(() => {
    // Clear pending marker once we mounted.
    if (!pendingAmount) return;
    sessionStorage.removeItem("pending_points_buy_amount");
  }, [pendingAmount]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setTxLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const txRes = await customFetch(`${import.meta.env.VITE_API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        if (txRes.ok) {
          const txJson = (await txRes.json()) as unknown;
          const txRoot = asObj(txJson);
          const txArrayRaw =
            (Array.isArray(txRoot?.transactions) && txRoot?.transactions) ||
            (Array.isArray(txRoot?.data) && txRoot?.data) ||
            [];

          const mapped: Transaction[] = txArrayRaw
            .map((item, index) => {
              const obj = asObj(item);
              if (!obj) return null;

              const amount = pickNumber(obj, ["amount", "points", "value", "delta", "coins"]) ?? 0;
              const txType =
                (pickString(obj, ["type", "transaction_type", "direction"]) || "").toLowerCase();
              const points =
                txType === "expense" || txType === "outcome" || txType === "debit"
                  ? -Math.abs(amount)
                  : Math.abs(amount);
              const description =
                pickString(obj, ["comment", "description", "title", "reason", "name", "type"]) ||
                "Transaction";
              const rawDate =
                pickString(obj, ["created_at", "date", "datetime", "createdAt"]) || "";
              const { date, time } = formatDateTime(rawDate);
              const id = String(
                pickNumber(obj, ["id"]) ?? pickString(obj, ["id", "uuid"]) ?? `${index + 1}`
              );

              return { id, date, time, description, points };
            })
            .filter((v): v is Transaction => v !== null);

          if (mapped.length > 0) setTransactions(mapped);
        }
      } catch (err) {
        console.error("Failed to load points data:", err);
      } finally {
        setTxLoading(false);
      }
    };

    fetchData();
  }, []);

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
              {effectiveNoticeAmount} {t("MyPoints.balance.unit")} {t("MyPoints.notice.added")}
            </div>
          )}

          <div className="my-points-card__bottom">
            <p className="my-points-card__value">
              {user ? user.points : "—"}
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
              {user ? user.referralsCount : "—"}
              <span className="my-points-card__unit">{t("MyPoints.referrals.unit")}</span>
            </p>
            <img src={rightArrow} alt="" className="my-points-card__arrow" />
          </div>
        </div>

        {/* Transaction history */}
        <div className="my-points-history">
          <h2 className="my-points-history__title">{t("MyPoints.history.title")}</h2>
          {txLoading ? (
            <p className="my-points-history__empty">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="my-points-history__empty">{t("MyPoints.history.empty")}</p>
          ) : (
            <ul className="my-points-history__list">
              {transactions.map((tx) => (
                <li key={tx.id} className="my-points-history__item">
                  <div className="my-points-history__meta">
                    <span className="my-points-history__date">
                      {tx.time ? `${tx.date} • ${tx.time}` : tx.date}
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
