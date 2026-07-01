# Okkhor - Client (Frontend)

## Project Overview
Okkhor-Client is the interactive frontend of the Okkhor blog management system. It provides a highly responsive, modern user interface designed for readers and content creators alike. This repository focuses on delivering a seamless user experience, handling client-side routing, state management, and real-time UI updates while communicating with the Okkhor-Server API.

## Key Features
- **Responsive User Interface:** A mobile-first design optimized for all screen sizes.
- **Infinite Scrolling:** Smooth content discovery powered by Intersection Observer and TanStack Infinite Query.
- **Activity Log:** Comprehensive user dashboard section tracking personal actions across the platform.
- **Flat Design & Accessibility:** Modern, shadow-free aesthetics with validated WCAG AA/AAA compliant high-contrast modes.
- **Role-Based Dashboards:** Distinct user interfaces for General Users, Moderators, and Admins to manage their specific tasks.
- **Author Public Profiles:** Dedicated public pages showcasing an author's blogs, follower counts, and overall reading analytics.
- **Admin Platform Analytics:** Exclusive dashboard for Admins featuring rich data visualizations (Recharts) to track user growth, blog publication trends, and system distributions.
- **Following & Connections:** Follow your favorite authors, view your follower lists seamlessly in a modal, and curate a customized "Following" blog feed.
- **Nested Threaded Comments:** Engage deeply with content using a recursive commenting system that supports infinite reply threading.
- **Dynamic Content Rendering:** Real-time updates for blog feeds, upvote/downvote counts, and community comments.
- **Interactive Forms:** Streamlined processes for adding and editing blogs with live tag suggestions and image previews.
- **Theme Customization:** Integrated Dark and Light mode toggle with persistent user preference.
- **Client-Side Security:** Private and role-protected routes to ensure users only access authorized sections.
- **Instant Notifications:** Real-time feedback via toast notifications for every user action.

## Tech Stack
- **React.js (Vite):** Building a high-performance, component-based user interface.
- **React Router DOM:** Managing client-side navigation and protected routes.
- **TanStack Query (React Query):** Handling asynchronous server state and caching.
- **Axios:** Robust API communication and secure interceptors.
- **Tailwind CSS:** Utility-first styling for rapid, responsive design.
- **Swiper.js:** Modern, touch-enabled sliders for featured content.
- **Recharts:** For rendering author analytics and dashboard data visualizations.
- **React Icons:** Scalable vector icons for enhanced visual cues.
- **Firebase Authentication:** Managing secure client-side user identity.
- **React Hot Toast:** Interactive, non-blocking user notifications.
- **React Helmet Async:** Dynamic SEO and document head management.

## Installation Steps
Okkhor-Client requires the [Okkhor-Server](https://github.com/RaisulKayesRaka/Okkhor-Server) to be running for data access.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RaisulKayesRaka/Okkhor-Client.git
   cd Okkhor-Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_firebase_auth_domain
   VITE_projectId=your_firebase_project_id
   VITE_storageBucket=your_firebase_storage_bucket
   VITE_messagingSenderId=your_firebase_messaging_sender_id
   VITE_appId=your_firebase_app_id
   VITE_imgbbApiKey=your_imgbb_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

### 🔗 Related Repository
- **Backend API:** [Okkhor-Server](https://github.com/RaisulKayesRaka/Okkhor-Server)
