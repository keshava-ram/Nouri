# Nouri 🥗💧
> **Intelligent Climate-Aware Nutrition & Hydration Companion**

Nouri is a full-stack web application designed to track your daily macronutrient and water intake while proactively solving nutritional deficits. Instead of simply logging what you ate, Nouri evaluates your remaining macronutrient gaps (e.g., *Need 38g protein*) and recommends climate-aligned, regional recipes to balance your day.

---

## 🌟 Key Features

1. **Smart Deficit Balancer ("What Can I Prepare Today?")**
   - Continuously computes remaining calories, protein, carbohydrates, and fats.
   - Highlights your primary macro gap (e.g. Protein deficit).
   - Suggests specific, tailored dishes with preparation notes and 1-click logging directly to Lunch, Dinner, or Snacks.

2. **Climate & Weather Intelligence**
   - Integrates live temperature, humidity, and condition forecasts via **Open-Meteo**.
   - **Hot weather**: Dynamically boosts hydration targets (e.g. +300ml to +600ml thermal buffer) and recommends cooling foods (buttermilk, cucumber pachadi, sprouted moong, coconut water).
   - **Cold/Rainy weather**: Prioritizes warming, gut-supportive foods (ginger broths, millets like bajra/ragi, spiced lentils).

3. **Daily Hydration Station**
   - Fast 1-tap logging (`+250ml`, `+500ml`, `+750ml`, or custom volume).
   - Visual progress bar that accounts for baseline hydration + climate thermal buffers.
   - Native Web Notification API integration to trigger reminders.

4. **Regional Cuisine & Dietary Personalization**
   - Pre-loaded with regional nutritional profiles: **South Indian**, **North Indian**, **Mediterranean**, **East Asian**, and **Continental**.
   - Dietary restriction filtering: **Vegetarian**, **Vegan**, **Eggetarian**, and **Non-Veg**.
   - Profile calculations for BMR and TDEE based on age, gender, height, weight, activity level, and goals (Fat Loss, Maintenance, Muscle Gain).

5. **Meal Logging & Food Library**
   - Categorized by **Breakfast**, **Lunch**, **Dinner**, and **Snacks**.
   - Built-in food library search with portion multipliers (0.5x, 1x, 1.5x, 2x).
   - Custom food entry for quick logging of homemade meals.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Database & ORM**: Prisma ORM with PostgreSQL (Neon works for free personal deployments)
- **Auth**: JWT Session tokens with HTTP-only cookies and bcrypt password hashing
- **Weather API**: Open-Meteo API (free, keyless real-time forecasts)
- **Alerts**: Web Notifications API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v20+ or v22+
- npm

### 2. Running Locally
Navigate to the project folder:
```bash
cd "C:\Users\krcn3\OneDrive\Documents\Engineering\Projects\Nouri"
```

Copy `.env.example` to `.env` and add your PostgreSQL connection strings and a private `JWT_SECRET`. Then generate the Prisma client and create the database tables:

```bash
npx prisma generate
npx prisma db push
```

Start the development server:
```bash
npm run dev
```

Open your browser and visit:
[http://localhost:3000](http://localhost:3000)

### 3. Demo Account
You can create your own account or click **"1-Click Demo Login"** on the sign-in modal to immediately test all features:
- **Email**: `demo@nouri.app`
- **Password**: `Password123!`

## ☁️ Free Personal Deployment (Vercel + Neon)

This project uses PostgreSQL so its database works on serverless hosting. Create a Neon PostgreSQL project, then import this GitHub repository into Vercel as a Next.js project. In Neon, copy the pooled connection string into `DATABASE_URL` and the direct connection string into `DIRECT_URL`. Set both values in Vercel along with a strong, private `JWT_SECRET`.

Set Vercel's build command to:

```bash
npx prisma generate && npx prisma db push && npm run build
```

Deploy the `main` branch. Vercel Hobby is free for personal and non-commercial projects. Neon Free has usage limits and can scale down while idle. Do not upload `.env` or the local SQLite database; the deployed PostgreSQL database starts separately.

---

## 📁 Project Structure

```text
Nouri/
├── prisma/
│   ├── schema.prisma       # PostgreSQL User, MealLog, WaterLog, FoodItem models
│   ├── seed.ts             # Pre-seeded nutritional library with climate attributes
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/       # register, login, logout, session routes
│   │   │   ├── foods/      # food search library API
│   │   │   ├── meals/      # meal logging & deletion API
│   │   │   ├── profile/    # health profile & target recalculation API
│   │   │   ├── recommendations/ # climate & deficit balancer API
│   │   │   └── water/      # hydration tracking API
│   │   ├── globals.css     # Tailwind styling
│   │   ├── layout.tsx      # App shell & metadata
│   │   └── page.tsx        # Main interactive dashboard
│   ├── components/
│   │   ├── AuthModal.tsx   # Sign in & registration dialog
│   │   ├── DeficitBalancer.tsx # Smart recipe & deficit recommendation card
│   │   ├── MealList.tsx    # Daily logged meals grouped by time of day
│   │   ├── MealLoggerModal.tsx # Food search & custom meal logger
│   │   ├── Navbar.tsx      # Brand, weather snippet, reminder controls
│   │   ├── NutritionalOverview.tsx # Calorie, protein, carbs, fats cards
│   │   ├── ProfileModal.tsx # Anthropometrics, diet, cuisine, and goals
│   │   └── WaterTracker.tsx # Hydration progress & 1-tap logging
│   └── lib/
│       ├── auth.ts         # Password hashing & JWT helpers
│       ├── notifications.ts # Browser Web Notifications
│       ├── nutrition-calculator.ts # BMR, TDEE, and macro formulas
│       ├── prisma.ts       # PrismaClient singleton
│       ├── recommendation-engine.ts # Deficit scoring & balancing algorithm
│       └── weather.ts      # Open-Meteo real-time climate integration
└── README.md
```
