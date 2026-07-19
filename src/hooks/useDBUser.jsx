import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useDBUser() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user?.email}`);
      return data;
    },
  });

  return { dbUser, isLoading };
}
