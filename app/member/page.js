"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

function MemberContent() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("id");

  const [member, setMember] = useState(null);
  const [points, setPoints] = useState(0);
  const [packsScanned, setPacksScanned] = useState(0);
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    async function loadMember() {
      const savedId = memberId || localStorage.getItem("ar_fresko_member_id");
      if (!savedId) return;

      const { data } = await supabase
        .from("club_members")
        .select("*")
        .eq("id", savedId)
        .single();

      if (data) {
        setMember(data);
        localStorage.setItem("ar_fresko_member_id", data.id);
      }
    }

    loadMember();
  }, [memberId]);

  useEffect(() => {
    async function loadPurchaseStats() {
      if (!member) return;

      const { data } = await supabase
        .from("purchase_history")
        .select("points")
        .eq("member_id", member.id);

      if (data) {
        setPacksScanned(data.length);
        setPoints(data.reduce((sum, row) => sum + (row.points || 0), 0));
      }
    }

    loadPurchaseStats();
  }, [member]);

  const scanner = new Html5QrcodeScanner(
    "barcode-reader",
    {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
      supportedScanTypes: [],
      videoConstraints: {
        facingMode: { exact: "environment" },
      },
    },
    false
  );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setScanResult(decodedText);
        await redeemBarcode(decodedText);
      },
      () => {}
    );
  }

  async function redeemBarcode(barcode) {
    if (!member) return alert("Member not loaded");

    const { data: pack } = await supabase
      .from("pack_barcodes")
      .select("*")
      .eq("barcode", barcode)
      .maybeSingle();

    if (!pack) return alert("Invalid AR Fresko barcode");

    if (pack.used) return alert("This pack has already been scanned");

    const { error: historyError } = await supabase
      .from("purchase_history")
      .insert({
        member_id: member.id,
        barcode: pack.barcode,
        product: pack.product,
        points: pack.points,
      });

    if (historyError) return alert(historyError.message);

    const { error: updateError } = await supabase
      .from("pack_barcodes")
      .update({
        used: true,
        used_by: member.id,
        used_at: new Date().toISOString(),
      })
      .eq("barcode", barcode);

    if (updateError) return alert(updateError.message);

    setPoints((prev) => prev + (pack.points || 0));
    setPacksScanned((prev) => prev + 1);

    alert(`${pack.product} added. +${pack.points} Fresko Points`);
  }

  if (!member) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Member Portal</h1>
          <p style={styles.subtitle}>Membership not found. Please sign in again.</p>
          <button style={styles.button} onClick={() => (window.location.href = "/club")}>
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
          {member.member_code || `Member #${String(member.member_no || "").padStart(4, "0")}`}
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <h3>{points}</h3>
            <p>Fresko Points</p>
          </div>

          <div style={styles.statBox}>
            <h3>{packsScanned}</h3>
            <p>Packs Scanned</p>
          </div>
        </div>

        <div style={styles.scanBox}>
          <h3>Scan Your Pack</h3>
          <p>
            Scan the unique barcode printed on the back of your AR Fresko sleeve
            to add this purchase to your history.
          </p>

          <button style={styles.button} onClick={startScanner}>
            Scan Pack Barcode
          </button>

          <div id="barcode-reader" style={{ marginTop: "16px" }}></div>

          {scanResult && <p style={styles.note}>Last scanned: {scanResult}</p>}
        </div>

       
      </section>
    </main>
  );


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