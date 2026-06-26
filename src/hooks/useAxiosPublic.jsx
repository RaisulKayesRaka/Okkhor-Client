import axios from "axios";
import toast from "react-hot-toast";

const axiosPublic = axios.create({
  baseURL: "https://okkhor-server.vercel.app",
});

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status >= 500) {
      toast.error(error.response?.data?.message || "Server error. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default function useAxiosPublic() {
  return axiosPublic;
}
