"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ClubContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "freshbbl";

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [joined, setJoined] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return alert("Please enter your name");
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return alert("Please enter a valid 10-digit WhatsApp number");

    const { error } = await supabase.from("club_members").upsert(
      {
        name: form.name,
        phone: form.phone,
        city: form.city,
        product,
      },
      { onConflict: "phone" }
    );

    if (error) return alert(error.message);

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
            <p style={styles.badge}>Founding Memberships Open</p>
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
              <input style={styles.input} placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input style={styles.input} placeholder="WhatsApp number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input style={styles.input} placeholder="City" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />

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
              Your member-only chef recipes are now unlocked.
            </p>
            <button style={styles.button} onClick={goToRecipes}>
              View Chef Recipes
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
  },
};