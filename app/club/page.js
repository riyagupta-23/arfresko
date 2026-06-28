"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ClubContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "freshbbl";

  const MEMBER_LIMIT = 2000;

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [memberNumber, setMemberNumber] = useState(null);

  const remainingMembers = Math.max(MEMBER_LIMIT - memberCount, 0);

  useEffect(() => {
    async function getMemberCount() {
      const { count, error } = await supabase
        .from("club_members")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setMemberCount(count);
      }
    }

    getMemberCount();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    const { error } = await supabase.from("club_members").upsert(
      {
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        product,
      },
      { onConflict: "phone" }
    );

    if (error) {
      alert(error.message);
      return;
    }

    const newCount = memberCount + 1;
    setMemberCount(newCount);
    setMemberNumber(newCount);
    localStorage.setItem("ar_fresko_club_member", "true");
    setJoined(true);
  }

  function goToRecipes() {
    window.location.href = `/${product}`;
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {!joined ? (
          <>
            <p style={styles.badge}>Limited to first 2,000 members</p>

            <p style={styles.counter}>
              {remainingMembers} founding memberships left
            </p>

            <h1 style={styles.title}>Welcome to the AR Fresko Club</h1>

            <p style={styles.subtitle}>
              Fresh chicken is just the beginning. Join as a founding member to
              unlock chef recipes, product trials, surprise rewards and
              member-only benefits.
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
            </form>
          </>
        ) : (
          <>
            <p style={styles.badge}>Membership Confirmed</p>

            <h1 style={styles.title}>Welcome to the Club 🎉</h1>

            <p style={styles.subtitle}>
              You are now one of the AR Fresko Founding Members.
            </p>

            <div style={styles.memberBox}>
              Member #{String(memberNumber || memberCount).padStart(4, "0")}
            </div>

            <div style={styles.benefits}>
              <p>✓ Chef Recipes Unlocked</p>
              <p>✓ Future Product Trials</p>
              <p>✓ Monthly Member Giveaways</p>
              <p>✓ Early Access to New Launches</p>
            </div>

            <button style={styles.button} onClick={goToRecipes}>
              Unlock Chef Recipes
            </button>

            <p style={styles.note}>
              More member benefits launching soon.
            </p>
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
    background: "#f7f3ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "520px",
    width: "100%",
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "#143d36",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    marginBottom: "12px",
  },
  counter: {
    color: "#143d36",
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "18px",
  },
  title: {
    fontSize: "34px",
    lineHeight: "1.1",
    margin: "0 0 14px",
    color: "#143d36",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "24px",
  },
  benefits: {
    textAlign: "left",
    background: "#f7f3ea",
    padding: "18px",
    borderRadius: "16px",
    marginBottom: "24px",
    color: "#143d36",
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
    background: "#143d36",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  memberBox: {
    background: "#143d36",
    color: "#fff",
    padding: "16px",
    borderRadius: "16px",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "22px",
  },
  note: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#777",
  },
};