import RecipeGate from "@/components/RecipeGate";

const recipes = [
    {
      title: "Creamy Herb Chicken Breast",
      time: "25 minutes",
      desc: "Pan-seared boneless chicken breast finished with garlic, herbs and light cream.",
      image: "/recipes/creamy-herb-chicken.jpg",
      ingredients: [
        "500g AR Fresko boneless chicken breast",
        "1 tbsp olive oil",
        "1 tbsp butter",
        "4 garlic cloves, chopped",
        "1/2 cup fresh cream",
        "Mixed herbs, salt and pepper",
      ],
      steps: [
        "Slice chicken breast evenly and season with salt, pepper and herbs.",
        "Sear in olive oil until golden on both sides.",
        "Add butter and garlic, then pour in cream.",
        "Simmer for 5–7 minutes until chicken is cooked and sauce thickens.",
        "Serve hot with rice, pasta or sautéed vegetables.",
      ],
    },
  {
    title: "High-Protein Chicken Salad",
    time: "20 minutes",
    desc: "Lean chicken breast with fresh vegetables, lemon dressing and roasted seeds.",
  },
  {
    title: "Tandoori Chicken Breast Tikka",
    time: "35 minutes",
    desc: "Yogurt-marinated breast pieces grilled until juicy and smoky.",
  },
];

export default function CurryCut() {
  return (
    <RecipeGate
      product="Curry Cut"
      recipes={recipes}
    />
  );
}