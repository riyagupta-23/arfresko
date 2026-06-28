"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function MemberContent() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("id");

  const [member, setMember] = useState(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    async function loadMember() {
      const savedId = memberId || localStorage.getItem("ar_fresko_member_id");

      if (!savedId) return;

      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("id", savedId)
        .single();

      if (!error && data) {
        setMember(data);
      }
    }

    loadMember();
  }, [memberId]);

  async function addPurchase() {
    if (!code.trim()) {
      alert("Please enter or scan your pack code");
      return;
    }

    alert("Purchase scan feature coming soon. Your code was captured: " + code);
    setCode("");
  }

  if (!member) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Member Portal</h1>
          <p style={styles.subtitle}>Membership not found. Please sign in again.</p>
          <button
            style={styles.button}
            onClick={() => (window.location.href = "/club")}
          >
            Go to Club Login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.badge}>AR Fresko Member Portal</p>

        <h1 style={styles.title}>Hi {member.name} 👋</h1>

        <div style={styles.memberBox}>
          Member #{String(member.member_no || "").padStart(4, "0")}
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <h3>0</h3>
            <p>Fresko Points</p>
          </div>

          <div style={styles.statBox}>
            <h3>0</h3>
            <p>Packs Scanned</p>
          </div>
        </div>

        <div style={styles.scanBox}>
          <h3>Scan Your Pack</h3>
          <p>
            Enter the code printed on the back of your AR Fresko pack to add it
            to your purchase history.
          </p>

          <input
            style={styles.input}
            placeholder="Enter pack code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button style={styles.button} onClick={addPurchase}>
            Add to Purchase History
          </button>

          <p style={styles.note}>
            Barcode/QR scanning and loyalty points will be activated soon.
          </p>
        </div>

        <button
          style={styles.secondaryButton}
          onClick={() => (window.location.href = "/freshbbl")}
        >
          View Chef Recipes
        </button>
      </section>
    </main>
  );
}

export default function MemberPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MemberContent />
    </Suspense>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FFF9F2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "520px",
    width: "100%",
    background: "#FFFFFF",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "#F47B20",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "32px",
    margin: "0 0 14px",
    color: "#0F4C4C",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "24px",
  },
  memberBox: {
    background: "#F47B20",
    color: "#fff",
    padding: "16px",
    borderRadius: "16px",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "22px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "22px",
  },
  statBox: {
    background: "#FFF3E6",
    borderRadius: "16px",
    padding: "16px",
    color: "#0F4C4C",
  },
  scanBox: {
    background: "#FFF3E6",
    padding: "18px",
    borderRadius: "16px",
    marginBottom: "18px",
    color: "#0F4C4C",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    marginBottom: "12px",
  },
  button: {
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    background: "#0F4C4C",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  secondaryButton: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #0F4C4C",
    background: "#FFFFFF",
    color: "#0F4C4C",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  note: {
    fontSize: "12px",
    color: "#777",
    marginTop: "10px",
  },
};