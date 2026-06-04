# Pro Manage Client

Pro Manage is a modern, responsive project and task management web client. It is built with React and Vite, utilizing Tailwind CSS for styling and Redux Toolkit for state management. It communicates with a Laravel backend API and features real-time updates via Pusher.

## 🚀 Features

- **Project & Task Management**: Organize projects, manage tasks, and track details with a responsive interface.
- **Drag and Drop**: Smooth interactive task reordering and board management (using `@hello-pangea/dnd`).
- **Real-Time Collaboration**: Real-time notifications and comment updates using Laravel Echo and Pusher.
- **State Management**: Powerful state management with Redux Toolkit.
- **Modern UI**: Polished, accessible UI components built with Shadcn, Radix UI, and Tailwind CSS.
- **Fast Development**: Powered by Vite for lightning-fast hot module replacement and optimized builds.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React Redux
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Network & API**: [Axios](https://axios-http.com/)
- **Real-Time**: [Laravel Echo](https://laravel.com/docs/broadcasting) + [Pusher JS](https://pusher.com/)

## ⚙️ Setup & Installation

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone & Install

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd pro-manage-client

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Open `.env` and adjust the variables according to your local environment. Most importantly, ensure the `VITE_API_BASE_URL` points to your Laravel backend.

```env
# API (Laravel) — must end with /api
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Pusher (realtime) — key + cluster from Pusher dashboard
VITE_PUSHER_APP_KEY=your_pusher_key
VITE_PUSHER_APP_CLUSTER=your_pusher_cluster
```

### 3. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The client will be available at [http://localhost:5173](http://localhost:5173).

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

You can preview the built application locally using:

```bash
npm run preview
```

## 🧹 Linting

To run the linter and ensure code quality:

```bash
npm run lint
```
