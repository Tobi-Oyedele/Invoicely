# Invoicely 🚀

Invoicely is an invoicing web application designed to help freelancers, contractors, and small business owners seamlessly create, track, and manage their billing workflows. With Invoicely, you can organize your client list, build beautiful multi-currency itemized invoices, and download production-grade vector PDF receipts instantly.

**Live URL**: [invoicely.online](https://invoicely.online)

---

## ✨ Features

- **🔒 Secure Authentication**: Instant user onboarding, password reset recovery flows, and secure sessions managed natively via Supabase Auth.
- **💼 Business Profile Checklist**: A custom-designed welcome onboarding dashboard that validation-checks and guides users to complete their billing details (bank credentials).
- **👥 Client Directory**: Create, edit, and keep track of a robust repository of recurring clients.
- **📝 Premium Invoice Composer**:
  - Unique invoice number generator.
  - Optional due date configuration.
  - Multi-currency itemized billing: Add/remove product entries dynamically with individual currency support (`USD`, `NGN`, `EUR`, `GBP`) per line item.
  - Live calculations: Key in rate/quantity values to see instant subtotal adjustments.
- **📊 Real-time Dashboard List**:
  - Interactive dashboard grouping subtotal amounts by active currency.
  - Clickable inline status badges (`draft`, `sent`, `paid`) to update invoice statuses instantly on the fly.
  - Local searching by invoice number or client name.
- **📄 Vector PDF Generation**: Download perfectly styled, print-ready, high-fidelity PDF documents generated client-side using `@react-pdf/renderer`.
- **🌓 Dynamic Dark Mode**: Sleek vanilla dark-mode adjustments throughout the app layouts.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Authentication**: [Supabase](https://supabase.com/)
- **PDF Renderer**: [@react-pdf/renderer 4](https://react-pdf.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Tobi-Oyedele/Invoicio.git
   cd invoice-generator
   ```

2. **Install Project Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_KEY=your-supabase-anon-key
   ```

4. **Launch the Local Development Server**:

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run lint
   ```

---

## 🗄️ Supabase Database Setup

To configure your database backend, run the SQL schema migration script inside your Supabase SQL Editor. This script handles table creation, establishes cascade deletes, sets up Row-Level Security (RLS) constraints, and applies security policies.

The full setup script is located in:
👉 **[supabase/schema.sql](file:///Users/tobz/Documents/invoice-generator/supabase/schema.sql)**

### How to Apply:
1. Log in to your [Supabase Dashboard](https://supabase.com/).
2. Select your project and navigate to the **SQL Editor** tab in the sidebar.
3. Click **New Query** to open a blank SQL query window.
4. Copy the complete SQL script from [supabase/schema.sql](file:///Users/tobz/Documents/invoice-generator/supabase/schema.sql) and paste it into the query window.
5. Click **Run** to execute the script.

---

## 📂 Folder Structure

```text
invoice-generator/
├── public/                 # Static static resources & favicon assets
├── src/
│   ├── assets/             # Branding resources and graphics
│   ├── components/
│   │   ├── dashboard/      # Sidebar and dynamic onboarding layouts
│   │   ├── invoices/       # LineItem editor grids and PDF designs
│   │   ├── layout/         # General Navbars, Footer, & Mobile menus
│   │   ├── profile/        # User bank details components
│   │   ├── sign-up/        # Onboarding branding logo
│   │   └── ui/             # Core shared reusable layouts
│   ├── data/               # Static navigation configs
│   ├── hooks/              # Custom context hooks (useTheme)
│   ├── lib/                # Supabase configurations and bindings
│   ├── pages/
│   │   ├── invoices/       # Invoice Index, Creator, and Detail pages
│   │   ├── Clients.tsx     # Reusable Client Directory Page
│   │   ├── Home.tsx        # Public Marketing Landing Page
│   │   ├── Profile.tsx     # Billing Profile Complete Page
│   │   ├── ResetPassword.tsx
│   │   ├── Settings.tsx    # General settings
│   │   └── Sign-in.tsx / Sign-Up.tsx
│   ├── utils/              # Helper utilities (Date calculations)
│   ├── App.tsx             # Main routing and navigation engine
│   ├── main.tsx            # React bundle injection
│   └── index.css           # General Tailwind utility layers
├── index.html              # Shell HTML root setup
├── tsconfig.json           # TS rulesets
├── vite.config.ts          # Vite build instructions
└── package.json            # Manifest file and script declarations
```

---

## 🤝 Contributing

We welcome contributions of any size! To contribute:

1. **Fork** the repository.
2. **Create a Feature Branch** (`git checkout -b feature/amazing-feature`).
3. **Commit Your Changes** (`git commit -m 'Add support for amazing feature'`).
4. **Push to Your Branch** (`git push origin feature/amazing-feature`).
5. **Open a Pull Request** for detailed code review.

Please ensure all contributions pass `npm run build` and `npm run lint` validation scripts.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](file:///Users/tobz/Documents/invoice-generator/LICENSE) for more details.
