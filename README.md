# Invoicely 🚀

Invoicely is an invoicing web application designed to help freelancers, contractors, and small business owners seamlessly create, track, and manage their billing workflows. With Invoicely, you can organize your client list, build beautiful multi-currency itemized invoices, and download production-grade vector PDF receipts instantly.

**Live URL**: [invoicely.online](https://invoicely.online)

---

## ✨ Features

- **🔒 Secure Authentication**: Instant user onboarding, password reset recovery flows, and sessions managed by the Express backend using HttpOnly cookies.
- **💼 Business Profile Checklist**: A custom-designed welcome onboarding dashboard that validation-checks and guides users to complete their billing details (bank credentials).
- **👥 Client Directory**: Create, edit, and keep track of a robust repository of recurring clients.
- **📝 Premium Invoice Composer**:
  - Unique invoice number generator.
  - Optional due date configuration.
  - Currency set once in your profile (`NGN`, `USD`, `EUR`, `GBP`, `CAD`); every new invoice uses it.
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
- **API Client & Validation**: Axios + Zod
- **Backend**: Separate Node.js/Express + MongoDB/Mongoose service
- **Hosting**: Vercel (frontend), Render (backend)
- **PDF Renderer**: [@react-pdf/renderer 4](https://react-pdf.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (use Node.js 24, matching the deployment environment)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running [Invoicely backend](https://github.com/Tobi-Oyedele/invoicely-backend)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Tobi-Oyedele/Invoicely.git
   cd Invoicely
   ```

2. **Install Project Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
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

## Backend connection

The frontend communicates with the separate Express backend through
`src/lib/http.ts`. Axios sends cookies with requests, and API responses are
validated with Zod before the app uses them. `AuthProvider` loads the current
user through `GET /auth/me` and shares authentication state with components.
The backend handles database access, passwords, invoice numbering, and ownership checks.

For production, set this in Vercel's **Production** environment and redeploy:

```text
VITE_API_BASE_URL=https://api.invoicely.online/api
```

Vite embeds `VITE_` variables in the browser bundle during the build. The API
address is public configuration. Never put database credentials, signing secrets,
or email-provider tokens in frontend environment variables. Configure the backend
to allow the frontend origin and credentials; see the backend repository for setup.

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
│   ├── lib/                # Axios API clients and Zod schemas
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
