import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Blogs from "../pages/Blogs/Blogs";
import BlogDetails from "../pages/Blogs/BlogDetails";
import PublicProfile from "../pages/PublicProfile";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../pages/Dashboard/User/MyProfile";
import AddBlog from "../pages/Dashboard/User/AddBlog";
import MyBlogs from "../pages/Dashboard/User/MyBlogs";
import SavedBlogs from "../pages/Dashboard/User/SavedBlogs";
import BlogReviewQueue from "../pages/Dashboard/Moderator/BlogReviewQueue";
import ReportedContents from "../pages/Dashboard/Moderator/ReportedContents";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AdminRoute from "./AdminRoute";
import ModeratorRoute from "./ModeratorRoute";
import UpdateBlog from "../pages/Dashboard/User/UpdateBlog";
import About from "../pages/About";
import FAQ from "../pages/FAQ";
import Analytics from "../pages/Dashboard/User/Analytics";
import SystemLogs from "../pages/Dashboard/Admin/SystemLogs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blogs/:id",
        element: <BlogDetails />,
      },
      {
        path: "/author/:id",
        element: <PublicProfile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="my-profile" replace />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "add-blog",
        element: <AddBlog />,
      },
      {
        path: "update-blog/:id",
        element: <UpdateBlog />,
      },
      {
        path: "my-blogs",
        element: <MyBlogs />,
      },
      {
        path: "saved-blogs",
        element: <SavedBlogs />,
      },
      {
        path: "blog-review-queue",
        element: (
          <ModeratorRoute>
            <BlogReviewQueue />
          </ModeratorRoute>
        ),
      },
      {
        path: "reported-contents",
        element: (
          <ModeratorRoute>
            <ReportedContents />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "system-logs",
        element: (
          <AdminRoute>
            <SystemLogs />
          </AdminRoute>
        ),
      },
    ],
  },
]);
