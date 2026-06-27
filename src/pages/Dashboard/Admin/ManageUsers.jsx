import { MdAddModerator, MdBlock, MdDelete } from "react-icons/md";
import { FaUser, FaUserShield } from "react-icons/fa6";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const { data: users = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      return res?.data;
    },
  });

  const handleMakeModerator = (id) => {
    const makeModerator = async () => {
      const res = await axiosSecure.patch(`/users/make-moderator/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("User made moderator successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-center">Are you sure you want to make this user a moderator?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              makeModerator();
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleMakeAdmin = (id) => {
    const makeAdmin = async () => {
      const res = await axiosSecure.patch(`/users/make-admin/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("User made admin successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-center">Are you sure you want to make this user an admin?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              makeAdmin();
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleMakeUser = (id) => {
    const makeUser = async () => {
      const res = await axiosSecure.patch(`/users/make-user/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("User role updated to User successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-center">Are you sure you want to make this user a regular User?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              makeUser();
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Helmet>
        <title>Manage Users | Okkhor</title>
      </Helmet>
      <section className="w-full">
        <DashboardPageHeader 
          title="Manage Users" 
          subtitle="View and manage user roles and access." 
        />

        <DashboardCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">User Info</th>
                  <th className="px-6 py-4 font-semibold">Current Role</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-black">
                {users.map((user) => (
                  <tr
                    key={user?._id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" src={user?.photoUrl || "https://ui-avatars.com/api/?name=" + user?.name} alt={user?.name} />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${user?.role === "admin"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                        : user?.role === "moderator"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                        {user?.role}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Role Management */}
                        <div className="flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                          <button
                            onClick={() => handleMakeUser(user?._id)}
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-white"
                            disabled={user?.role === "user"}
                            title="Make User"
                          >
                            <FaUser size={14} />
                          </button>
                          <button
                            onClick={() => handleMakeModerator(user?._id)}
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-white"
                            disabled={user?.role === "moderator"}
                            title="Make Moderator"
                          >
                            <MdAddModerator size={18} />
                          </button>
                          <button
                            onClick={() => handleMakeAdmin(user?._id)}
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-white"
                            disabled={user?.role === "admin"}
                            title="Make Admin"
                          >
                            <FaUserShield size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </section>
    </>
  );
}
