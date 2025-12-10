import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://okkhor-server.vercel.app",
});

export default function useAxiosPublic() {
  return axiosPublic;
}
