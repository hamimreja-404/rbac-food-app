import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api, { authAPI } from "../services/api"; // Make sure default 'api' is imported
import Input from "../components/Input";
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const COUNTRIES = ["India", "America"];
const ROLES = ["admin", "manager", "member"];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]); // State for fetched users

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    country: "India",
  });

  // Fetch users from the backend when the page loads
  useEffect(() => {
    const fetchDemoUsers = async () => {
      try {
        const { data } = await api.get("/test/users");
        if (data.success) {
          setDemoUsers(data.data);
        }
      } catch (err) {
        console.error("Failed to load demo users:", err);
      }
    };
    fetchDemoUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.success("Logging in...", { id: "auth" });
    try {
      const { data } = await authAPI.login(loginForm);
      login(data.token);
      toast.success(`Welcome back! 🍴`, { id: "auth" });
      navigate('/home'); // Send to home page on success
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed", { id: "auth" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register(registerForm);
      login(data.token);
      toast.success("Account created! 🎉");
      navigate('/home'); // Send to home page on success
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = (email) => {
    setTab("login");
    setLoginForm({ email, password: "password123" });
    toast.success("Demo credentials loaded!", { icon: "⚡" });
  };

  return (
    <div className="min-h-screen flex bg-[#f5f6f8] font-sans">
      {/* LEFT PANEL — Authentication Form (Swiggy Style) */}
      <div className="w-full lg:w-125 bg-white shadow-2xl flex flex-col justify-center p-10 z-10 relative">
        <div className="max-w-sm w-full mx-auto">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white text-xl">🍴</span>
            </div>
            <h1 className="font-extrabold text-3xl text-gray-900 tracking-tight">
              Fork<span className="text-orange-500">It</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {tab === "login" ? "Login" : "Sign up"}
            </h2>
            <p className="text-sm text-gray-500">
              or{" "}
              <button
                type="button"
                onClick={() => setTab(tab === "login" ? "register" : "login")}
                className="text-orange-500 font-semibold hover:underline"
              >
                {tab === "login"
                  ? "create an account"
                  : "login to your account"}
              </button>
            </p>
          </div>

          <div className="w-8 h-1 bg-orange-500 mb-8 rounded-full"></div>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white mt-4 py-3.5 text-base font-bold"
              >
                LOGIN
              </Button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <form
              onSubmit={handleRegister}
              className="space-y-4 animate-fade-in"
            >
              <Input
                label="Full Name"
                placeholder="Tony Stark"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="tony@stark.com"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                    value={registerForm.role}
                    onChange={(e) =>
                      setRegisterForm((p) => ({ ...p, role: e.target.value }))
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                    value={registerForm.country}
                    onChange={(e) =>
                      setRegisterForm((p) => ({
                        ...p,
                        country: e.target.value,
                      }))
                    }
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white mt-6 py-3.5 text-base font-bold"
              >
                CREATE ACCOUNT
              </Button>
            </form>
          )}

          <p className="text-xs text-gray-400 text-center mt-8">
            By clicking on Login, I accept the Terms & Conditions & Privacy
            Policy
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Demo Accounts Showcase */}
      <div className="hidden lg:flex flex-1 flex-col bg-orange-50/50 relative overflow-hidden p-12">
        <div className="absolute top-0 right-0 w-125 h-125 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-yellow-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto w-full h-full flex flex-col">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Test RBAC instantly.
            </h2>
            <p className="text-lg text-gray-600">
              Click any user below to auto-fill their credentials and explore
              country & role restrictions.
            </p>
          </div>

          {/* Dynamic User Cards Grid */}
          <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-10 pr-4 custom-scrollbar">
            {demoUsers.length === 0 ? (
              <p className="text-gray-500">Loading demo users from database...</p>
            ) : (
              demoUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => loadDemoUser(user.email)}
                  className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-500 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.name.replace(" ", "+")}&background=random&color=fff`}
                        alt={user.name}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md
                      ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "manager"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md flex items-center gap-1">
                      {user.country === "India" ? "🇮🇳" : "🇺🇸"} {user.country}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}