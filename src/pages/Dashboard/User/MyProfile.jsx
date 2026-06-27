import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";

export default function MyProfile() {
  const { user, updateUserProfile, updateUserPassword, reauthenticateUser, deleteUserProfile, logOut, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      setIsEditing(false);
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
      setIsChangingPassword(false);
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
        <DashboardCard className="mx-auto max-w-2xl text-center">
          <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"></div>
          <div className="relative -mt-16 px-6 pb-8">
            <div className="mx-auto inline-block rounded-full border-4 border-white p-1 dark:border-gray-900">
              <img
                className="h-32 w-32 rounded-full object-cover"
                src={user?.photoURL}
                alt={user?.displayName}
                referrerPolicy="no-referrer"
              />
            </div>
            
            {!isEditing && !isChangingPassword ? (
              <>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {user?.displayName}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Edit Profile
                  </button>
                  {user?.providerData?.[0]?.providerId === "password" && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      Change Password
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                  >
                    Delete Account
                  </button>
                </div>
              </>
            ) : isEditing ? (
              <form onSubmit={handleUpdate} className="mt-6 text-left">
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
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="mt-6 text-left">
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
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </DashboardCard>
      </section>
    </>
  );
}
