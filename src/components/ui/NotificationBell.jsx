import api from "@/services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import echo from "@/utils/echo";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchNotifications();

    if (user && user.id) {
      const channel = echo.private(`App.Models.User.${user.id}`);

      channel.notification((notification) => {
        setNotifications((prev) => [
          {
            id: notification.id,
            data: notification,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      });

      return () => {
        channel.stopListening(
          ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
        );
        echo.leaveChannel(`App.Models.User.${user.id}`);
      };
    }
  }, [user]);

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

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));

      setIsOpen(false);
      if (actionUrl) {
        navigate(actionUrl, { replace: true });
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 font-semibold text-gray-700">
            Notifications
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() =>
                    handleMarkAsRead(notif.id, notif.data.action_url)
                  }
                  className="p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">
                      {notif.data.inviter_name}
                    </span>{" "}
                    {notif.data.message}
                    <span className="font-semibold">
                      {" "}
                      {notif.data.project_name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </p>
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
