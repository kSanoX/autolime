import React from "react";
import { Switch } from "@/components/ui/switch"; // или путь к твоему Switch

export default function NotificationSettings() {
  const [wash, setWash] = React.useState(false);
  const [subscription, setSubscription] = React.useState(true);
  const [promo, setPromo] = React.useState(false);

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        margin: "16px",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "20px", color: "#183D69", fontWeight: 600, marginBottom: "24px" }}>
        Notification settings
      </h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <p style={{ fontSize: "15px", color: "#183D69", fontWeight: 500 }}>Wash appointment</p>
        <Switch checked={wash} onCheckedChange={setWash} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <p style={{ fontSize: "15px", color: "#183D69", fontWeight: 500 }}>Subscription renewal</p>
        <Switch checked={subscription} onCheckedChange={setSubscription} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "15px", color: "#183D69", fontWeight: 500 }}>Special promotions</p>
        <Switch checked={promo} onCheckedChange={setPromo} />
      </div>
    </div>
  );
}
