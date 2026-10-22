import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const foods = [
  // --- South Indian ---
  {
    name: "Sprouted Moong Sundal",
    category: "Protein",
    cuisine: "South Indian",
    dietType: "vegan",
    climateAttribute: "cooling",
    servingSize: "1 bowl (150g)",
    calories: 165,
    protein: 14,
    carbs: 24,
    fats: 2.5,
    fiber: 7,
    recipeNotes: "Boil sprouted green gram with mustard seeds, curry leaves, and a touch of grated coconut. Excellent light protein."
  },
  {
    name: "Curd with Cucumber & Mint (Pachadi/Raita)",
    category: "Dairy",
    cuisine: "South Indian",
    dietType: "vegetarian",
    climateAttribute: "cooling",
    servingSize: "1 cup (200g)",
    calories: 120,
    protein: 8,
    carbs: 10,
    fats: 4.5,
    fiber: 1.5,
    recipeNotes: "Whisk fresh probiotic curd with diced cucumber, mint, and roasted cumin. Hydrating and gut-soothing on hot days."
  },
  {
    name: "Spiced Buttermilk (Majjiga / Neer Mor)",
    category: "Beverages",
    cuisine: "South Indian",
    dietType: "vegetarian",
    climateAttribute: "cooling",
    servingSize: "1 tall glass (300ml)",
    calories: 60,
    protein: 4,
    carbs: 6,
    fats: 1.5,
    fiber: 0.5,
    recipeNotes: "Diluted curd churned with ginger, green chili, curry leaves, and rock salt. Restores electrolytes immediately."
  },
  {
    name: "Ragi Mudde (Finger Millet Ball)",
    category: "Grain",
    cuisine: "South Indian",
    dietType: "vegan",
    climateAttribute: "cooling",
    servingSize: "1 medium ball (150g)",
    calories: 190,
    protein: 4.5,
    carbs: 42,
    fats: 1.2,
    fiber: 6.5,
    recipeNotes: "Steamed finger millet flour. High calcium and sustained complex energy release."
  },
  {
    name: "Egg Poriyal / Scramble with Curry Leaves",
    category: "Protein",
    cuisine: "South Indian",
    dietType: "eggetarian",
    climateAttribute: "neutral",
    servingSize: "2 whole eggs + 1 white",
    calories: 185,
    protein: 18,
    carbs: 3,
    fats: 11,
    fiber: 1,
    recipeNotes: "Sauté chopped onions, green chilies, and curry leaves; scramble eggs with turmeric and black pepper."
  },
  {
    name: "Sambar with Moringa (Drumstick) & Mixed Veg",
    category: "Protein",
    cuisine: "South Indian",
    dietType: "vegan",
    climateAttribute: "neutral",
    servingSize: "1 large bowl (250ml)",
    calories: 150,
    protein: 8,
    carbs: 22,
    fats: 3,
    fiber: 5,
    recipeNotes: "Toor dal cooked with drumstick, shallots, tamarind, and warming spices like fenugreek and coriander."
  },
  {
    name: "Steamed Idli with Coconut Chutney",
    category: "Grain",
    cuisine: "South Indian",
    dietType: "vegan",
    climateAttribute: "neutral",
    servingSize: "2 idlis (120g)",
    calories: 160,
    protein: 5,
    carbs: 32,
    fats: 1,
    fiber: 2,
    recipeNotes: "Fermented rice and urad dal steamed cakes. Easy on digestion, good breakfast base."
  },

  // --- North Indian ---
  {
    name: "Paneer Bhurji (Low Oil)",
    category: "Protein",
    cuisine: "North Indian",
    dietType: "vegetarian",
    climateAttribute: "neutral",
    servingSize: "1 bowl (150g)",
    calories: 260,
    protein: 20,
    carbs: 6,
    fats: 17,
    fiber: 2,
    recipeNotes: "Crumble fresh cottage cheese with tomatoes, onions, coriander, and turmeric. High protein vegetarian powerhouse."
  },
  {
    name: "Besan Chilla (Savory Gram Flour Crepe)",
    category: "Protein",
    cuisine: "North Indian",
    dietType: "vegan",
    climateAttribute: "neutral",
    servingSize: "2 chillas (120g)",
    calories: 220,
    protein: 13,
    carbs: 28,
    fats: 6,
    fiber: 5.5,
    recipeNotes: "Gram flour batter mixed with spinach, ajwain (carom seeds), onions, cooked lightly on a cast iron pan."
  },
  {
    name: "Dal Tadka (Yellow Moong & Toor)",
    category: "Protein",
    cuisine: "North Indian",
    dietType: "vegan",
    climateAttribute: "neutral",
    servingSize: "1 bowl (200g)",
    calories: 175,
    protein: 11,
    carbs: 25,
    fats: 3.5,
    fiber: 4.5,
    recipeNotes: "Lentils tempered with cumin, garlic, and hing (asafoetida). Excellent comforting staple."
  },
  {
    name: "Bajra (Pearl Millet) Roti with White Butter",
    category: "Grain",
    cuisine: "North Indian",
    dietType: "vegetarian",
    climateAttribute: "warming",
    servingSize: "1 medium roti (60g)",
    calories: 170,
    protein: 4.2,
    carbs: 29,
    fats: 4,
    fiber: 5,
    recipeNotes: "Ideal for chilly or rainy days. High in iron, zinc, and warming thermodynamic properties."
  },
  {
    name: "Tandoori Chicken Breast",
    category: "Protein",
    cuisine: "North Indian",
    dietType: "non-veg",
    climateAttribute: "warming",
    servingSize: "150g grilled",
    calories: 210,
    protein: 36,
    carbs: 3,
    fats: 5.5,
    fiber: 1,
    recipeNotes: "Marinated in yogurt, roasted chili, garlic, and garam masala. Lean high-protein staple."
  },
  {
    name: "Masala Chai with Ginger & Tulsi (No Sugar)",
    category: "Beverages",
    cuisine: "North Indian",
    dietType: "vegetarian",
    climateAttribute: "warming",
    servingSize: "1 cup (150ml)",
    calories: 45,
    protein: 2,
    carbs: 4,
    fats: 2,
    fiber: 0,
    recipeNotes: "Brewed black tea with crushed fresh ginger, holy basil, cardamom, and a splash of milk. Warms respiratory tract."
  },
  {
    name: "Boiled Chickpea (Chana) Chaat",
    category: "Snacks",
    cuisine: "North Indian",
    dietType: "vegan",
    climateAttribute: "cooling",
    servingSize: "1 bowl (150g)",
    calories: 195,
    protein: 11,
    carbs: 32,
    fats: 3,
    fiber: 8,
    recipeNotes: "Toss boiled kabuli chana with chopped onions, cucumbers, tomatoes, lemon juice, and chaat masala."
  },

  // --- Mediterranean & Continental ---
  {
    name: "Greek Yogurt Bowl with Chia & Berries",
    category: "Dairy",
    cuisine: "Mediterranean",
    dietType: "vegetarian",
    climateAttribute: "cooling",
    servingSize: "200g yogurt + 15g chia",
    calories: 210,
    protein: 22,
    carbs: 16,
    fats: 6,
    fiber: 5,
    recipeNotes: "Plain unsweetened Greek yogurt packed with casein and whey protein. Refreshing summer breakfast."
  },
  {
    name: "Grilled Chicken & Avocado Garden Salad",
    category: "Protein",
    cuisine: "Mediterranean",
    dietType: "non-veg",
    climateAttribute: "cooling",
    servingSize: "1 large bowl (300g)",
    calories: 340,
    protein: 35,
    carbs: 10,
    fats: 17,
    fiber: 6,
    recipeNotes: "Mixed greens, grilled chicken strips, avocado, cherry tomatoes, and olive oil lemon dressing."
  },
  {
    name: "Hummus with Cucumber & Carrot Sticks",
    category: "Snacks",
    cuisine: "Mediterranean",
    dietType: "vegan",
    climateAttribute: "cooling",
    servingSize: "4 tbsp hummus + veggies",
    calories: 170,
    protein: 7,
    carbs: 19,
    fats: 8,
    fiber: 6,
    recipeNotes: "Blended chickpeas and tahini with raw crunchy vegetables. Keeps you hydrated and full."
  },
  {
    name: "Mediterranean Lentil & Vegetable Soup",
    category: "Protein",
    cuisine: "Mediterranean",
    dietType: "vegan",
    climateAttribute: "warming",
    servingSize: "1 large bowl (350ml)",
    calories: 220,
    protein: 14,
    carbs: 34,
    fats: 3,
    fiber: 9,
    recipeNotes: "Brown lentils slow-cooked with carrots, celery, oregano, and garlic. Hearty and warming for cold evenings."
  },
  {
    name: "Pan-Seared Tofu with Garlic & Broccoli",
    category: "Protein",
    cuisine: "Continental",
    dietType: "vegan",
    climateAttribute: "neutral",
    servingSize: "180g tofu + broccoli",
    calories: 230,
    protein: 21,
    carbs: 9,
    fats: 12,
    fiber: 4,
    recipeNotes: "Firm tofu cubed and pan-seared with minimal sesame/olive oil, minced garlic, and steamed broccoli."
  },
  {
    name: "Hard Boiled Eggs (3 whites, 1 whole)",
    category: "Protein",
    cuisine: "Universal",
    dietType: "eggetarian",
    climateAttribute: "neutral",
    servingSize: "4 eggs (1 whole + 3 whites)",
    calories: 160,
    protein: 22,
    carbs: 1,
    fats: 6,
    fiber: 0,
    recipeNotes: "Quickest zero-effort protein fix. Sprinkle with black pepper and pink salt."
  },
  {
    name: "Whey Protein Shake (with Water or Almond Milk)",
    category: "Protein",
    cuisine: "Universal",
    dietType: "vegetarian",
    climateAttribute: "neutral",
    servingSize: "1 scoop (30g powder in 250ml water)",
    calories: 125,
    protein: 25,
    carbs: 2.5,
    fats: 1.5,
    fiber: 0.5,
    recipeNotes: "Rapidly absorbed protein to immediately bridge a 25g+ deficit without excess calories."
  },
  {
    name: "Tender Coconut Water",
    category: "Beverages",
    cuisine: "Universal",
    dietType: "vegan",
    climateAttribute: "cooling",
    servingSize: "1 fresh coconut (300ml)",
    calories: 55,
    protein: 1.5,
    carbs: 12,
    fats: 0.2,
    fiber: 2.5,
    recipeNotes: "Natural isotonic drink filled with potassium, magnesium, and hydration factors. Ideal for hot weather."
  }
];

async function main() {
  console.log('Seeding Food Items database...');
  await prisma.foodItem.deleteMany({});

  for (const food of foods) {
    await prisma.foodItem.create({
      data: food,
    });
  }

  console.log(`Successfully seeded ${foods.length} nutritious foods across diverse cuisines!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
