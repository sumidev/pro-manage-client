import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { API_BASE_URL, PUSHER } from "@/config/appConfig";

window.Pusher = Pusher;

const token = localStorage.getItem("token");

const echo = new Echo({
  broadcaster: "pusher",
  key: PUSHER.key,
  cluster: PUSHER.cluster,
  forceTLS: true,
  authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  },
});

export default echo;
