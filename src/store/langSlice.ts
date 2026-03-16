import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LangState = {
  translations: Record<string, any>;
};

const initialState: LangState = {
  translations: {
    Shop: {
      header: { title: "Shop" },
      balance: { label: "Balance", unit: "Coins" },
      categories: {
        discounts: "Discounts",
        giveaway: "Giveaway",
      },
      all: "All",
      vouchers: {
        title: "My Vouchers",
        buyMore: "Buy more",
      },
      tickets: {
        title: "My Tickets",
        daysLeft: "days left",
        join: "Join the giveaway",
      },
    },
    ReferralsInfo: {
      header: { title: "Referrals" },
      promo: {
        title: "GeoCar referrals",
        desc: "This is a loyalty program that gives participants the opportunity to accumulate points and exchange them for gifts or discounts from partners.",
        btn: "Share Referral Link",
      },
      how: {
        title: "How it works?",
        step1: "Share your referral link to register new users",
        step2: "Earn points for packages connected by your referrals",
        step3: "Exchange points for discount vouchers from our partners",
      },
      sheet: {
        title: "Share Referral Link",
        yourLink: "Your link",
        shareTo: "Sharet to:",
      },
    },
    PointsInfo: {
      header: { title: "Points" },
      promo: {
        title: "GeoCar points",
        desc: "This is a loyalty program that gives participants the opportunity to accumulate points and exchange them for gifts or discounts from partners.",
        btn: "Buy GeoCar points",
      },
      sheet: {
        title: "Buy GeoCar points",
        placeholder: "Points amount",
        amountLabel: "Amount to pay",
        buyBtn: "Buy",
      },
      how: {
        title: "How it works?",
        step1: "Purchase points using a bank card or cryptocurrency",
        step2: "Earn points with your referrals",
        step3: "Exchange points for discount vouchers from our partners",
      },
    },
    MyPoints: {
      header: { title: "My points" },
      balance: { label: "Balance", unit: "points" },
      referrals: { label: "Referrals", unit: "people" },
      notice: { added: "points added" },
      history: { title: "Transaction history", empty: "No transactions" },
    },
    Sidebar: {
      menu: {
        myPackages: "My packages",
        shop: "Shop",
        myReviews: "My reviews",
        myPoints: "My points",
        messages: "Messages",
        settings: "Settings",
        contacts: "Contacts",
        help: "Help",
      },
    },
  },
};

export const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setTranslations(state, action: PayloadAction<Record<string, any>>) {
      state.translations = action.payload;
    },
  },
});

export const { setTranslations } = langSlice.actions;
export default langSlice.reducer;