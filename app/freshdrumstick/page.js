import RecipeGate from "@/components/RecipeGate";

const recipes = [
  {
    title: "Punjabi Masala Drumsticks",
    time: "35 minutes",
    desc: "Juicy chicken drumsticks cooked with onion, tomato, ginger and whole spices.",
  },
  {
    title: "Honey Chilli Drumsticks",
    time: "30 minutes",
    desc: "Chicken drumsticks tossed in a sweet, spicy and garlicky glaze.",
  },
  {
    title: "Air Fryer Tandoori Drumsticks",
    time: "40 minutes",
    desc: "Marinated drumsticks air fried for a smoky, healthier family meal.",
  },
];

export default function FreshDrumstick() {
  return <RecipeGate product="Fresh Chicken Drumsticks" recipes={recipes} />;
}