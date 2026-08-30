# تحدي عالطاير

<div align="center">
  <img src="assets/icon.png" alt="تحدي عالطاير Logo" width="150" />
</div>
A fast-paced interactive game application built with modern web technologies and packaged for mobile platforms.

*"فكّر بسرعة... والعب عالطاير!"*
*(Think fast... and play on the fly!)*

## Live Demo
[https://tahady-al-tayer-game.vercel.app/](https://tahady-al-tayer-game.vercel.app/)

## Overview
"تحدي عالطاير" is an interactive game where players face multiple rounds of quick challenges. It features:
- One referee, four rounds
- Each round brings a completely new challenge
- Fast-paced gameplay

## Tech Stack
This project is built using a modern, performant web stack and wrapped for mobile devices:
- **Framework:** [React 19](https://react.dev/)
- **Routing & SSR:** [TanStack Start](https://tanstack.com/start/latest) & [TanStack Router](https://tanstack.com/router/latest)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Mobile Packaging:** [Capacitor](https://capacitorjs.com/) (iOS & Android)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository
2. Install dependencies using your preferred package manager (e.g., npm or bun):
   ```bash
   npm install
   ```

### Development
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000` (or another port specified by Vite).

### Building for Production
To build the web application for production:
```bash
npm run build
```

### Mobile Development (Capacitor)
This project is configured to be built as a native mobile application using Capacitor.
1. Sync web assets with native projects:
   ```bash
   npx cap sync
   ```
2. Open the project in Android Studio or Xcode:
   ```bash
   npx cap open android
   npx cap open ios
   ```

## License
This project is proprietary and confidential.
