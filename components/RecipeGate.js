"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";

export default function RecipeGate({ product, recipes }) {
  const [phone, setPhone] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  async function submitPhone(e) {
    e.preventDefault();
  
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
  
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        product,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.error || "Something went wrong.");
      return;
    }
    
    localStorage.setItem(`unlocked_${product}`, "true");

    const productName =
  product === "breast"
    ? "Boneless Skinless Chicken Breast"
    : "Drumstick";
    
    if (product === "breast") {
      window.location.href = "/freshbbl";
    } else if (product === "drumstick") {
      window.location.href = "/drumstick";
    }
  }


  
  async function saveRecipePDF(recipe) {
    const doc = new jsPDF();
  
    doc.setFillColor(255, 247, 237);
    doc.rect(0, 0, 210, 297, "F");
  
    doc.setFillColor(245, 130, 31);
    doc.rect(0, 0, 210, 45, "F");
  
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("AR Fresko", 15, 22);

    try {
        const logoResponse = await fetch("/logo.png");
        const logoBlob = await logoResponse.blob();
      
        const logoReader = new FileReader();
      
        await new Promise((resolve) => {
          logoReader.onloadend = resolve;
          logoReader.readAsDataURL(logoBlob);
        });
      
        doc.addImage(
          logoReader.result,
          "PNG",
          10,
          10,
          40,
          30
        );
      } catch (e) {
        console.log("Logo could not be loaded");
      }
  
    doc.setTextColor(7, 31, 69);
    doc.setFontSize(22);
    doc.text(recipe.title, 55, 25);
  
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Time: ${recipe.time}`, 15, 55);

    doc.setFontSize(10);

doc.text(
  "Specially curated for AR Fresko customers",
  15,
  60
);

doc.text(
  "Chef Harpal Singh Sokhi",
  15,
  65
);
  
    let y = 82;
  
    if (recipe.image) {
      try {
        const img = await fetch(recipe.image);
        const blob = await img.blob();
  
        const reader = new FileReader();
  
        await new Promise((resolve) => {
          reader.onloadend = resolve;
          reader.readAsDataURL(blob);
        });
  
        doc.addImage(reader.result, "JPEG", 15, y, 180, 70);
        y += 84;
      } catch (e) {
        y += 5;
      }
    }
  
    doc.setTextColor(245, 130, 31);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Ingredients", 15, y);
  
    y += 10;
  
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
  
    recipe.ingredients?.forEach((item) => {
      const lines = doc.splitTextToSize(`• ${item}`, 180);
      doc.text(lines, 15, y);
      y += lines.length * 7;
    });
  
    y += 8;
  
    doc.setTextColor(245, 130, 31);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Method", 15, y);
  
    y += 10;
  
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
  
    recipe.steps?.forEach((step, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${step}`, 180);
      doc.text(lines, 15, y);
      y += lines.length * 7;
    });
  
    doc.setFillColor(7, 31, 69);
    doc.rect(0, 278, 210, 19, "F");
  
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("© 2026 AR Fresko. All rights reserved. FSSAI Licensed.", 15, 289);
  
    doc.save(`${recipe.title}-AR-Fresko.pdf`);
  }

  async function shareRecipePDF(recipe) {
    const text = `Try this AR Fresko recipe: ${recipe.title}\n\n${recipe.desc}\n\nFreshness you can trust.`;
  
    if (navigator.share) {
      await navigator.share({
        title: recipe.title,
        text,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this device. Please use Save PDF.");
    }
  }
  
  return (
    <main className="page">
      <section className="hero">
        <img src="/logo.png" alt="AR Fresko" className="logo" />
        <h1>{product}</h1>
      </section>

      {!unlocked ? (
        <form onSubmit={submitPhone} className="gate-card">
          <h3>Unlock 3 Chef-Style Recipes</h3>
          <p>Enter your phone number to view recipes made for this pack.</p>

          <div className="phone-input">
            <span>+91</span>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength="10"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
            />
          </div>

          <button>VIEW RECIPES</button>

          <small>
            By continuing, you agree to receive recipe and product updates from
            AR Fresko.
          </small>
        </form>
      ) : (
        <section className="recipe-grid">
          {recipes.map((r, i) => (
            <button
              key={i}
              className="recipe-card"
              onClick={() => setSelectedRecipe(r)}
            >
              <p className="recipe-number">Recipe {i + 1}</p>
              <h3>{r.title}</h3>
              <p>
                <b>Time:</b> {r.time}
              </p>
              <p>{r.desc}</p>
            </button>
          ))}
        </section>
      )}

      

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedRecipe(null)}
            >
              ×
            </button>

            {selectedRecipe.image && (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="recipe-image"
              />
            )}

            <p className="recipe-number">Chef Recipe</p>
            <h2>{selectedRecipe.title}</h2>
            <p>
              <b>Time:</b> {selectedRecipe.time}
            </p>

            <p>{selectedRecipe.desc}</p>
            <div className="recipe-actions">
  <button
    className="pdf-button"
    onClick={() => saveRecipePDF(selectedRecipe)}
  >
    SAVE RECIPE PDF
  </button>

  <button
    className="share-button"
    onClick={() => shareRecipePDF(selectedRecipe)}
  >
    SHARE RECIPE
  </button>
</div>

            {selectedRecipe.ingredients && (
              <>
                <h4>Ingredients</h4>
                <ul>
                  {selectedRecipe.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedRecipe.steps && (
              <>
                <h4>Method</h4>
                <ol>
                  {selectedRecipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        © 2026 AR Fresko. All rights reserved. FSSAI Licensed.
      </footer>
    </main>
  );
}