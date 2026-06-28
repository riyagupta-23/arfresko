"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Html5QrcodeScanner } from "html5-qrcode";

function ClubContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "freshbbl";
  const [scanResult, setScanResult] = useState("");
  const MEMBER_LIMIT = 5000;

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [memberNumber, setMemberNumber] = useState(null);

  const remainingMembers = Math.max(MEMBER_LIMIT - memberCount, 0);

  useEffect(() => {
    async function getMemberCount() {
      const { count } = await supabase
        .from("club_members")
        .select("*", { count: "exact", head: true });

      if (count !== null) setMemberCount(count);
    }

    getMemberCount();

    const savedMemberNo = localStorage.getItem("ar_fresko_member_no");
    if (savedMemberNo) {
      setMemberNumber(savedMemberNo);
      setJoined(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
  
    const cleanPhone = form.phone.trim();
  
    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }
  
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert("Please enter a valid 10-digit WhatsApp number");
      return;
    }
  
    // 1. First check if phone already exists
    const { data: existingMember, error: checkError } = await supabase
      .from("club_members")
      .select("*")
      .eq("phone", cleanPhone)
      .maybeSingle();
  
    if (checkError) {
      alert(checkError.message);
      return;
    }
  
    // 2. If exists, log them in — do NOT create new row
    if (existingMember) {
      localStorage.setItem("ar_fresko_club_member", "true");
      localStorage.setItem("ar_fresko_member_id", existingMember.id);
      localStorage.setItem("ar_fresko_member_no", existingMember.member_no);
      localStorage.setItem("ar_fresko_member_code", existingMember.member_code);
      localStorage.setItem(`unlocked_${product}`, "true");
  
      window.location.href = `/member?id=${existingMember.id}`;
      return;
    }
  
    // 3. Only create new member if phone does not exist
    const memberCode =
      "FRESKO-" +
      Math.random().toString(36).substring(2, 7).toUpperCase();
  
    const { data, error } = await supabase
      .from("club_members")
      .insert({
        name: form.name.trim(),
        phone: cleanPhone,
        city: form.city.trim(),
        product,
        member_code: memberCode,
      })
      .select()
      .single();
  
    if (error) {
      alert(error.message);
      return;
    }
  
    localStorage.setItem("ar_fresko_club_member", "true");
    localStorage.setItem("ar_fresko_member_id", data.id);
    localStorage.setItem("ar_fresko_member_no", data.member_no);
    localStorage.setItem("ar_fresko_member_code", data.member_code);
    localStorage.setItem(`unlocked_${product}`, "true");
  
    setMemberNumber(data.member_code || data.member_no);
    setMemberCount((prev) => prev + 1);
    setJoined(true);
  }
  async function signInExistingMember() {
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return alert("Enter your registered WhatsApp number first");
    }

    const { data, error } = await supabase
      .from("club_members")
      .select("*")
      .eq("phone", form.phone.trim())
      .maybeSingle();

    if (error) return alert(error.message);

    if (!data) {
      alert("No membership found with this number. Please become a member first.");
      return;
    }

    localStorage.setItem("ar_fresko_club_member", "true");
    localStorage.setItem("ar_fresko_member_id", data.id);
    localStorage.setItem("ar_fresko_member_no", data.member_no);
    localStorage.setItem(`unlocked_${product}`, "true");
    
    window.location.href = `/member?id=${data.id}`;
  }

  function goToRecipes() {
    localStorage.setItem(`unlocked_${product}`, "true");
    window.location.href = `/${product}`;
  }

  function startScanner() {
    const scanner = new Html5QrcodeScanner(
      "barcode-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );
  
    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setScanResult(decodedText);
        await redeemBarcode(decodedText);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async function redeemBarcode(barcode) {
    if (!member) {
      alert("Member not loaded");
      return;
    }
  
    const { data: pack, error: packError } = await supabase
      .from("pack_barcodes")
      .select("*")
      .eq("barcode", barcode)
      .maybeSingle();
  
    if (packError) {
      alert(packError.message);
      return;
    }
  
    if (!pack) {
      alert("Invalid AR Fresko barcode");
      return;
    }
  
    if (pack.used) {
      alert("This pack has already been scanned");
      return;
    }
  
    const { error: historyError } = await supabase
      .from("purchase_history")
      .insert({
        member_id: member.id,
        barcode: pack.barcode,
        product: pack.product,
        points: pack.points,
      });
  
    if (historyError) {
      alert(historyError.message);
      return;
    }
  
    const { error: updateError } = await supabase
      .from("pack_barcodes")
      .update({
        used: true,
        used_by: member.id,
        used_at: new Date().toISOString(),
      })
      .eq("barcode", barcode);
  
    if (updateError) {
      alert(updateError.message);
      return;
    }
  
    alert(`${pack.product} added to your purchase history. +${pack.points} Fresko Points`);
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {!joined ? (
          <>
            <p style={styles.badge}>Limited to first 5,000 members</p>

            <p style={styles.counter}>
              {remainingMembers} founding memberships left
            </p>

            <h1 style={styles.title}>Welcome to the AR Fresko Club</h1>

            <p style={styles.subtitle}>
              Join as a founding member to unlock chef recipes, product trials,
              surprise rewards and member-only benefits.
            </p>

            <div style={styles.benefits}>
              <p>✓ Member-only chef recipes</p>
              <p>✓ Early access to new launches</p>
              <p>✓ Free tasting opportunities</p>
              <p>✓ Monthly giveaways</p>
              <p>✓ Vote on future products</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                style={styles.input}
                placeholder="WhatsApp number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                style={styles.input}
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <button style={styles.button} type="submit">
                Become a Member
              </button>

              <button
                style={styles.secondaryButton}
                type="button"
                onClick={signInExistingMember}
              >
                Already a member? Sign in
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={styles.badge}>Membership Confirmed</p>

            <h1 style={styles.title}>Welcome to the Club 🎉</h1>

            <p style={styles.subtitle}>
              Your member-only chef recipes are now unlocked.
            </p>

            <button
  style={styles.memberBoxButton}
  onClick={() => {
    const memberId = localStorage.getItem("ar_fresko_member_id");
    window.location.href = `/member?id=${memberId}`;
  }}
>
  Member #{String(memberNumber || "").padStart(4, "0")}
  <br />
  <span style={{ fontSize: "13px", fontWeight: "normal" }}>
    Click to open your portal
  </span>
</button>

            <button style={styles.button} onClick={goToRecipes}>
              Unlock Chef Recipes
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default function ClubPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClubContent />
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
  counter: {
    color: "#F47B20",
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "18px",
  },
  title: {
    fontSize: "34px",
    lineHeight: "1.1",
    margin: "0 0 14px",
    color: "#0F4C4C",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "24px",
  },
  benefits: {
    textAlign: "left",
    background: "#FFF3E6",
    padding: "18px",
    borderRadius: "16px",
    marginBottom: "24px",
    color: "#0F4C4C",
    fontSize: "15px",
    lineHeight: "1.4",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
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
  memberBox: {
    background: "#F47B20",
    color: "#fff",
    padding: "16px",
    borderRadius: "16px",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "22px",
  },
  memberBoxButton: {
    background: "#F47B20",
    color: "#fff",
    padding: "16px",
    borderRadius: "16px",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "22px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};