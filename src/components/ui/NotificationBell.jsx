import api from "@/services/api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import echo from "@/utils/echo";
import { Bell, X, CheckCheck } from "lucide-react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const channelName = `App.Models.User.${user.id}`;
    const channel = echo.private(channelName);

    const onNotification = (notification) => {
      const payload = notification.data ?? notification;
      const id = notification.id;
      if (!id) return;

      setNotifications((prev) => {
        if (prev.some((n) => n.id === id)) return prev;
        return [
          {
            id,
            data: {
              inviter_name: payload.inviter_name,
              project_name: payload.project_name,
              message: payload.message ?? "invited you to join the project",
              action_url: payload.action_url,
              type: payload.type,
            },
            created_at: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    };

    channel.notification(onNotification);

    return () => {
      channel.stopListening(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated");
      echo.leave(`private-${channelName}`);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = async (id, actionUrl) => {
    try {
      await api.post(`/notifications/${id}/mark-as-read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setIsOpen(false);
      if (actionUrl) {
        const path = actionUrl.startsWith("/") ? actionUrl : `/${actionUrl}`;
        navigate(path, { replace: true });
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded transition-all"
        style={{ color: "#b3d4ff" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { if (!isOpen) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#b3d4ff"; } }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
            style={{ background: "#de350b" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-80 rounded shadow-xl border z-50 fade-in overflow-hidden"
          style={{ background: "#fff", borderColor: "#dfe1e6", top: "calc(100% + 4px)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #dfe1e6" }}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: "#172b4d" }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#ffebe6", color: "#de350b" }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded transition-all"
              style={{ color: "#97a0af" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; e.currentTarget.style.color = "#172b4d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#97a0af"; }}
            >
              <X size={13} />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "#f4f5f7" }}
                >
                  <CheckCheck size={18} style={{ color: "#97a0af" }} />
                </div>
                <p className="text-sm font-medium" style={{ color: "#6b778c" }}>
                  All caught up!
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#97a0af" }}>
                  No new notifications
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.data.action_url)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                  style={{ borderBottom: "1px solid #f4f5f7" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                >
                  {/* Unread dot */}
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#0052cc" }} />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed" style={{ color: "#172b4d" }}>
                      <span className="font-semibold">{notif.data.inviter_name}</span>{" "}
                      {notif.data.message}{" "}
                      <span className="font-semibold">{notif.data.project_name}</span>
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: "#97a0af" }}>
                      {new Date(notif.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
