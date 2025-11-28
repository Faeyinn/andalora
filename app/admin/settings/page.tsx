"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";
import {
  User as UserIcon,
  Settings,
  Bell,
  Save,
  Loader2,
  Shield,
  Mail,
  Smartphone,
  Globe,
  AlertTriangle,
} from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [university, setUniversity] = useState("");
  const [nim, setNim] = useState("");

  // Password Form State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // General Settings State (Mock)
  const [siteName, setSiteName] = useState("Andalora Marketplace");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification Settings State (Mock)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profile) {
          setUser(profile);
          setFullName(profile.full_name || "");
          setPhone(profile.phone || "");
          setWhatsapp(profile.whatsapp || "");
          setUniversity(profile.university || "");
          setNim(profile.nim || "");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          phone,
          whatsapp,
          university,
          nim,
        })
        .eq("id", user?.id);

      if (error) throw error;

      if (password) {
        if (password !== confirmPassword) {
          throw new Error("Password tidak cocok");
        }
        const { error: passError } = await supabase.auth.updateUser({
          password: password,
        });
        if (passError) throw passError;
        setPassword("");
        setConfirmPassword("");
      }

      Swal.fire("Berhasil", "Profil berhasil diperbarui", "success");
      fetchProfile();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire("Gagal", error.message || "Gagal memperbarui profil", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Swal.fire("Berhasil", "Pengaturan umum disimpan (Simulasi)", "success");
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Swal.fire(
        "Berhasil",
        "Pengaturan notifikasi disimpan (Simulasi)",
        "success"
      );
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <UserIcon size={20} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "general"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <Settings size={20} />
            General
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "notifications"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <Bell size={20} />
            Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon className="text-purple-600" />
                Edit Profile
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-md">
                    {user?.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-3xl font-bold">
                        {user?.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {user?.full_name}
                    </h3>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      University
                    </label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      NIM
                    </label>
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="text-purple-600 w-5 h-5" />
                    Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "general" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="text-purple-600" />
                General Settings
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Maintenance Mode
                      </h3>
                      <p className="text-sm text-gray-500">
                        Disable access to the marketplace for users.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveGeneral}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="text-purple-600" />
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Email Alerts
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive daily summaries and critical alerts via email.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Push Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive real-time notifications on your device.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
