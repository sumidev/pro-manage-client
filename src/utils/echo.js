import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { API_BASE_URL, REVERB } from "@/config/appConfig";

window.Pusher = Pusher;

const token = localStorage.getItem("token");

const echo = new Echo({
  broadcaster: "reverb",
  key: REVERB.key,
  wsHost: REVERB.host,
  wsPort: REVERB.port,
  wssPort: REVERB.port,
  forceTLS: REVERB.scheme === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  },
});

export default echo;
