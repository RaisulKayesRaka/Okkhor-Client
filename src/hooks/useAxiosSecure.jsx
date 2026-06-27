import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_baseUrl || "http://localhost:5000",
});

export default function useAxiosSecure() {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login");
      } else if (status >= 500) {
        toast.error(error.response?.data?.message || "Server error. Please try again later.");
      }
      return Promise.reject(error);
    },
  );

  return axiosSecure;
}
