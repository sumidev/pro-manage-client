import React, { useState, useRef, useEffect } from "react";
import {
  User, Lock, Mail, LogOut, Loader2, ShieldCheck, Camera, AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updatePassword, updateProfile } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import { resolveStorageUrl } from "@/config/appConfig";

const SectionCard = ({ children, title, icon: Icon, iconBg, iconColor }) => (
  <div
    className="rounded border overflow-hidden"
    style={{ background: "#fff", borderColor: "#dfe1e6" }}
  >
    <div
      className="flex items-center gap-3 px-5 py-4"
      style={{ borderBottom: "1px solid #dfe1e6" }}
    >
      <div
        className="w-8 h-8 rounded flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <h2 className="text-sm font-bold" style={{ color: "#172b4d" }}>
        {title}
      </h2>
    </div>
    <div className="px-5 py-5">{children}</div>
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      if (user.profile_pic) {
        setPreviewUrl(resolveStorageUrl(user.profile_pic));
      }
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsProfileSaving(true);
    try {
      await toast.promise(
        dispatch(updateProfile({ first_name: firstName, last_name: lastName, profile_pic: selectedFile })).unwrap,
        { loading: "Saving...", success: "Profile updated!", error: (err) => `${err.message}` }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setIsPasswordSaving(true);
    try {
      await toast.promise(
        dispatch(updatePassword({
          current_password: passwords.current,
          password: passwords.new,
          password_confirmation: passwords.confirm,
        })).unwrap,
        { loading: "Updating...", success: "Password changed!", error: (err) => `${err.message}` }
      );
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const isProfileUnchanged =
    firstName === (user?.first_name || "") &&
    lastName === (user?.last_name || "") &&
    !selectedFile;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      {/* Page header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold" style={{ color: "#172b4d" }}>
          Account settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#6b778c" }}>
          Manage your profile and security preferences
        </p>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <SectionCard title="Profile information" icon={User} iconBg="#e8f0fe" iconColor="#0052cc">
        <form onSubmit={handleProfileSave}>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
                style={{ border: "3px solid #dfe1e6" }}
                onClick={() => fileInputRef.current.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ background: "#0052cc" }}
                  >
                    {getInitials(firstName || user?.first_name)}
                  </div>
                )}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(9,30,66,0.6)" }}
                >
                  <Camera size={18} className="text-white mb-0.5" />
                  <span className="text-[10px] text-white font-medium">Change</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <span className="text-[10px]" style={{ color: "#97a0af" }}>
                JPG, PNG · Max 2MB
              </span>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="pm-label block mb-1.5">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pm-input"
                    required
                  />
                </div>
                <div>
                  <label className="pm-label block mb-1.5">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pm-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="pm-label block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#97a0af" }} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="pm-input pl-8 opacity-60 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: "#97a0af" }}>
                  Email cannot be changed for security reasons.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isProfileSaving || isProfileUnchanged}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "#0052cc" }}
                  onMouseEnter={(e) => { if (!isProfileSaving && !isProfileUnchanged) e.currentTarget.style.background = "#0065ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#0052cc"; }}
                >
                  {isProfileSaving && <Loader2 size={13} className="animate-spin" />}
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </SectionCard>

      {/* ===== SECURITY CARD ===== */}
      <SectionCard title="Security" icon={ShieldCheck} iconBg="#e3fcef" iconColor="#006644">
        <form onSubmit={handlePasswordSave} className="max-w-lg space-y-4">
          <div>
            <label className="pm-label block mb-1.5">Current password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="pm-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="pm-label block mb-1.5">New password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="pm-input"
                minLength={8}
                required
              />
            </div>
            <div>
              <label className="pm-label block mb-1.5">Confirm password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="pm-input"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isPasswordSaving || !passwords.current || !passwords.new || !passwords.confirm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#172b4d" }}
              onMouseEnter={(e) => { if (!isPasswordSaving) e.currentTarget.style.background = "#253858"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#172b4d"; }}
            >
              {isPasswordSaving ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
              Update password
            </button>
          </div>
        </form>
      </SectionCard>

      {/* ===== DANGER ZONE ===== */}
      <div
        className="rounded border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: "#ffebe6", borderColor: "#ff8f73" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} style={{ color: "#de350b" }} />
            <h3 className="text-sm font-bold" style={{ color: "#bf2600" }}>
              Sign out
            </h3>
          </div>
          <p className="text-xs" style={{ color: "#974f0c" }}>
            You'll need to log back in to access your projects.
          </p>
        </div>
        <button
          onClick={() => dispatch(logoutUser())}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-all shrink-0"
          style={{ background: "#fff", color: "#de350b", border: "1px solid #ff8f73" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#ffebe6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
