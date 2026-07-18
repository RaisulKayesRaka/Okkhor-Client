import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { Link } from"react-router-dom";
import { IoClose } from"react-icons/io5";
import toast from"react-hot-toast";
import useAxiosPublic from"../hooks/useAxiosPublic";
import useAxiosSecure from"../hooks/useAxiosSecure";
import useAuth from"../hooks/useAuth";

export default function FollowListModal({ isOpen, onClose, title, type, userId }) {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["followList", type, userId, user?.email],
    queryFn: async () => {
      let url = `/users/${userId}/${type}`;
      if (user?.email) {
        url += `?viewerEmail=${user.email}`;
      }
      const { data } = await axiosPublic.get(url);
      return data;
    },
    enabled: isOpen && !!userId,
  });

  const { mutate: toggleFollow, isPending } = useMutation({
    mutationFn: async (targetId) => {
      const { data } = await axiosSecure.post(`/users/follow/${targetId}`);
      return { data, targetId };
    },
    onSuccess: ({ data, targetId }) => {
      // Invalidate the list to refresh the follow buttons
      queryClient.invalidateQueries({ queryKey: ["followList", type, userId] });
      // Also invalidate stats on profile pages
      queryClient.invalidateQueries({ queryKey: ["publicProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authorAnalytics"] });
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ||"Failed to toggle follow");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-900 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
            {title || type}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex-1">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400 dark:text-gray-600 dark:text-gray-400">
              No users found.
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between gap-4">
                  <Link
                    to={`/author/${u._id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 overflow-hidden flex-1"
                  >
                    <img
                      src={u.photoUrl ||"https://i.ibb.co/3s2CptX/placeholder.jpg"}
                      alt={u.name}
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                      <h4 className="truncate font-semibold text-gray-900 dark:text-white">
                        {u.name}
                      </h4>
                    </div>
                  </Link>

                  {user && user.email !== u.email && (
                    <button
                      onClick={() => toggleFollow(u._id)}
                      disabled={isPending}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition flex-shrink-0 ${
                        u.isFollowing
                          ?"bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          :"bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
                      }`}
                    >
                      {u.isFollowing ?"Unfollow" :"Follow"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
