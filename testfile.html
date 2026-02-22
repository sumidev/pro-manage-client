# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Bhai, teri progress **bohot badhiya** hai! 👏
Sabse mushkil kaam (Kanban Drag & Drop) tune nipta diya hai. Ab bas wo cheezein bachi hain jo isse "Software" se "Product" banayengi.

Agar 30 Jan ko launch karna hai, to **User Profile Page ko kaat de list se.** Abhi uski zaroorat nahi hai. Initials (JD, RS) se kaam chal jayega.

Ye rahi teri **Final To-Do List** (Apni copy mein note kar le). Maine priority ke hisaab se set kiya hai:

---

### **🚀 Phase 1: Collaboration (Sabse Zaroori - 2 Days)**

*Kyunki bina doston ko add kiye, wo trial kaise lenge?*

#### **1. Invite/Add Member Feature (Project Board)**

* **Backend:**
* Ek API endpoint: `/projects/{id}/invite`.
* Logic: Email validation -> User search (`User::where('email', $email)->first()`) -> Pivot table attach (`$project->users()->syncWithoutDetaching($user->id)`).
* Error Handling: Agar user register nahi hai, to error de: "User not found".


* **Frontend:**
* Header mein "Invite" button (jo tune pending rakha hai).
* Ek chhota Modal: Input box (Enter Email) + "Add" Button.
* Success hone par list update honi chahiye.



#### **2. Task Detail: Dropdowns & Assignments**

* **Assignee Dropdown:**
* Task Detail modal ke andar, Assignee ko click karne par wahi list khule jo filter mein banayi thi.
* Select karte hi API call jaye aur update ho jaye.


* **Status & Priority Dropdown:**
* Simple `<select>` ya custom dropdown.
* Change hone par board refresh hona chahiye (ya local state update).



---

### **💬 Phase 2: Communication (1 Day)**

*Task pe baat cheet karna zaroori hai.*

#### **3. Comments System**

* **Backend:**
* Table: `comments` (id, body, task_id, user_id, timestamps).
* API: `GET /tasks/{id}/comments` aur `POST /tasks/{id}/comments`.


* **Frontend (Task Detail Modal):**
* Niche ek list: Avatar + Name + Message + Time (e.g., "2 hours ago").
* Ek Input box + Send Button.
* Real-time (Pusher) abhi mat daal, bas add hone par list refresh kar de.



---

### **🔍 Phase 3: Usability & Filters (1-2 Days)**

*Ab cheezen dhundhna aasaan banao.*

#### **4. Kanban Filters (Jo code humne banaya)**

* Wo `TaskFilters.jsx` component ko Board pe integrate kar.
* Invite karne ke baad jab members badhenge, tab hi iska asli fayda dikhega.

#### **5. Dashboard Polish**

* **Search:** Projects list ke upar ek simple search bar laga de.
* **Pagination:** Agar Laravel use kar raha hai to `->paginate(10)` aur frontend pe Next/Prev button. (Agar projects kam hain to ise skip kar sakta hai abhi).

---

### **❌ Phase 4: Ignore List (Mat banana abhi)**

In cheezon pe time waste mat karna 30 taareekh tak:

1. **User Profile Page:** (Naam edit karna, photo upload karna - Rehne de).
2. **Forgot Password:** (Agar dost password bhool jaye, database se reset kar dena).
3. **Notifications:** (Bell icon mat bana).
4. **Settings Page.**

---

### **📝 Tera 5-Day Schedule**

* **Kal (25 Jan):** **Invite User Functionality.** (Backend + Frontend). Ye sabse critical hai.
* **26 Jan:** **Task Detail Logic.** (Assignee change, Status change, Priority change).
* **27 Jan:** **Comments System.**
* **28 Jan:** **Filters Integration** (Dashboard & Board).
* **29 Jan:** **Testing & Deployment.** (Vercel/Railway/Shared Hosting pe daal ke check karna).
* **30 Jan:** **Launch!** 🚀

**Next Step:**
Abhi sabse pehle **Invite User** wala kaam utha. Kyunki jab tak dost project mein ghusenge nahi, wo task drag kaise karenge?

Start karu Invite User ka backend/frontend logic dena?














src/
├── assets/              # Images, SVGs, Fonts, Global CSS
│   ├── images/
│   └── icons/
│
├── components/          # 🧩 GLOBAL Reusable "Dumb" Components (UI only, No Logic)
│   ├── ui/              # Chhote tukde (Atomic Design)
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Avatar.jsx   # (Jo tune abhi banaya)
│   │   ├── Modal.jsx
│   │   └── Badge.jsx
│   │
│   └── layout/          # Page Wrappers
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── ProtectedRoute.jsx
│
├── features/            # 🚀 THE GAME CHANGER (Saara Business Logic yahan)
│   ├── auth/            # Auth se related sab kuch ek jagah
│   │   ├── components/  # LoginForm, RegisterForm
│   │   ├── hooks/       # useAuth
│   │   └── authSlice.js # Redux Slice
│   │
│   ├── projects/        # Project Board Logic
│   │   ├── components/  # KanbanBoard, TaskCard, InviteModal
│   │   ├── api/         # Project specific API calls
│   │   └── projectSlice.js
│   │
│   └── dashboard/       # Dashboard specific widgets
│       └── ProjectList.jsx
│
├── hooks/               # 🎣 Global Hooks (jo har jagah kaam aayein)
│   ├── useDebounce.js
│   ├── useClickOutside.js
│   └── useMediaQuery.js
│
├── pages/               # 📄 Sirf Route Views (Zyada logic nahi, bas assemble karna)
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── ProjectBoardPage.jsx
│
├── services/            # 🌐 API Configuration
│   ├── api.js           # Axios Instance (Interceptors yahan honge)
│   └── endpoints.js     # Saare URLs ek jagah
│
├── store/               # 🏪 Redux Configuration
│   ├── store.js         # Main Store
│   └── rootReducer.js   # Combine Reducers
│
├── utils/               # 🛠️ Helper Functions & Constants
│   ├── constants.js     # (AVATAR_COLORS, PRIORITY_LEVELS)
│   ├── formatDate.js    # Date formatting logic
│   ├── validators.js    # Email regex check etc.
│   └── helpers.js       # getInitials, etc.
│
├── App.jsx              # Routes Setup
└── main.jsx             # Entry Point (Providers)