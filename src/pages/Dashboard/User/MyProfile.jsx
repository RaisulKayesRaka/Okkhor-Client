import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
import FollowListModal from "../../../components/FollowListModal";

export default function MyProfile() {
  const { user, updateUserProfile, updateUserPassword, reauthenticateUser, deleteUserProfile, logOut, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("followers");

  const [name, setName] = useState(user?.displayName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: analytics } = useQuery({
    queryKey: ["analytics", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/analytics/${user?.email}`);
      return res?.data;
    },
    enabled: !!user?.email,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Firebase
      await updateUserProfile({ displayName: name, photoURL: photoUrl });
      // Update local state forcefully to trigger re-render
      setUser({ ...user, displayName: name, photoURL: photoUrl });
      
      // 2. Update MongoDB
      await axiosSecure.patch(`/users/${user?.email}`, { name, photoUrl });
      
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate first
      await reauthenticateUser(oldPassword);
      // Then update password
      await updateUserPassword(newPassword);
      
      toast.success("Password changed successfully!");
      setNewPassword("");
      setOldPassword("");
    } catch (err) {
      if (err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password") {
        toast.error("Incorrect old password.");
      } else if (err?.code === "auth/requires-recent-login") {
        toast.error("Please log out and log back in to verify your identity before changing your password.");
      } else {
        toast.error(err?.message || "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to PERMANENTLY delete your account? This will also delete all your blogs, reviews, and votes. This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      // 1. Delete from MongoDB (cascading deletes)
      await axiosSecure.delete(`/users/${user?.email}`);
      
      // 2. Delete from Firebase
      await deleteUserProfile();
      
      // 3. Log out and redirect
      await logOut();
      toast.success("Your account has been deleted.");
      navigate("/");
    } catch (err) {
      // Firebase throws 'auth/requires-recent-login' if the user hasn't authenticated recently
      if (err?.code === "auth/requires-recent-login") {
        toast.error("Please log out and log back in to verify your identity before deleting your account.");
      } else {
        toast.error(err?.message || "Failed to delete account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile | Okkhor</title>
      </Helmet>
      <section className="w-full">
        <DashboardPageHeader 
          title="My Profile" 
          subtitle="Manage your personal information and security settings." 
        />

        {/* Analytics Summary */}
        {analytics && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DashboardCard className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Blogs</h3>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalBlogs || 0}</p>
            </DashboardCard>
            <DashboardCard className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upvotes</h3>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalUpvotes || 0}</p>
            </DashboardCard>
            <DashboardCard className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Downvotes</h3>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalDownvotes || 0}</p>
            </DashboardCard>
            <DashboardCard className="p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Views</h3>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalViews || 0}</p>
            </DashboardCard>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <DashboardCard className="border-none bg-gray-50 p-8 text-center shadow-none dark:bg-gray-900/50">
              <img
                className="mx-auto mb-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
                src={user?.photoURL}
                alt={user?.displayName}
                referrerPolicy="no-referrer"
              />
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {user?.displayName}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              {analytics && (
                <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                  <div 
                    className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                    onClick={() => { setModalType("followers"); setIsModalOpen(true); }}
                  >
                    <span className="text-2xl font-bold text-black dark:text-white">{analytics.followersCount || 0}</span>
                    <span className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Followers</span>
                  </div>
                  <div className="h-10 w-px bg-gray-300 dark:bg-gray-700"></div>
                  <div 
                    className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                    onClick={() => { setModalType("following"); setIsModalOpen(true); }}
                  >
                    <span className="text-2xl font-bold text-black dark:text-white">{analytics.followingCount || 0}</span>
                    <span className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Following</span>
                  </div>
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Right Column: Settings Cards */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Edit Profile */}
            <DashboardCard className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h3>
              <form onSubmit={handleUpdate} className="text-left">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Photo URL</label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </DashboardCard>

            {/* Change Password */}
            {user?.providerData?.[0]?.providerId === "password" && (
              <DashboardCard className="p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Security</h3>
                <form onSubmit={handlePasswordChange} className="text-left">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      required
                      minLength="6"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </DashboardCard>
            )}

            {/* Danger Zone */}
            <DashboardCard className="border-red-100 bg-red-50/30 p-6 dark:border-red-900/30 dark:bg-red-900/10">
              <h3 className="mb-2 text-lg font-bold text-red-600 dark:text-red-500">Danger Zone</h3>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Delete Account
              </button>
            </DashboardCard>
          </div>
        </div>
      </section>

      {analytics && (
        <FollowListModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          title={modalType === "followers" ? "Followers" : "Following"}
          userId={analytics._id}
        />
      )}
    </>
  );
}
