# 🛍️ Next.js E-Commerce Project

A modern, full-stack e-commerce storefront built with **Next.js 16**, **React 19**, **Supabase**, and **Sanity CMS**. Designed with a clean UI, smooth UX, and a scalable architecture ready for production.

---

## ✨ Features

- 🏠 **Home Page** — Hero banners, sliders, featured products, and map section
- 🛒 **Product Catalog** — Browse, search, and filter products with a range slider
- 🛍️ **Shopping Cart** — Add/remove items, quantity control, persistent cart state via Redux
- 💳 **Checkout** — Full checkout flow with order placement
- 📦 **Orders Management** — View and track placed orders
- 📬 **Contact Page** — Contact form with email support via Nodemailer
- 🔐 **Authentication** — Secure login/register with NextAuth.js
- 🌍 **Interactive Map** — Location display using Leaflet & React-Leaflet
- 🌐 **Multi-Currency Support** — Localized pricing
- 🔔 **Toast Notifications** — Real-time feedback with react-hot-toast
- 🖼️ **Image Uploads** — Upload API for product/settings images
- 🗄️ **Admin Panel** — Basic admin route for managing content

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | [Supabase](https://supabase.com/) |
| CMS | [Sanity](https://www.sanity.io/) |
| Auth | [NextAuth.js](https://next-auth.js.org/) |
| State Management | Redux Toolkit |
| Maps | Leaflet + React-Leaflet |
| Email | Nodemailer |
| Notifications | react-hot-toast |
| Carousel | Swiper.js |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx          # Home
│   │   └── (pages)/
│   │       ├── products/     # Product listing
│   │       ├── cart/         # Shopping cart
│   │       ├── checkout/     # Checkout
│   │       ├── contact/      # Contact form
│   │       ├── admin/        # Admin panel
│   │       └── error/        # Error page
│   └── api/                  # API routes (upload, etc.)
├── components/               # Reusable UI components
├── redux/                    # Redux store & slices
├── lib/                      # Supabase & Sanity clients
├── locales/                  # i18n / currency locales
├── types/                    # TypeScript types
└── utils/                    # Utility functions
supabase/
├── schema.sql                # Database schema
└── demo_data.sql             # Sample seed data
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- A [Sanity](https://www.sanity.io/) project

### 1. Clone the repository

```bash
git clone https://github.com/099B/Nextjs-Ecommerce-Project.git
cd Nextjs-Ecommerce-Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file at the root and fill in the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Nodemailer (Email)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Set up the database

Run the SQL files in your Supabase SQL editor:

```
1. Apply the schema   → supabase/schema.sql
2. Load demo data     → supabase/demo_data.sql  (optional)
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an [issue](https://github.com/099B/Nextjs-Ecommerce-Project/issues) or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
