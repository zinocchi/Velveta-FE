import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // axios instance
import type { AxiosError } from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    newsletter: true,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await api.post("/register", form);
      navigate("/login");
    } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err) {
          const error = err as AxiosError<{ errors: Record<string, string[]> }>;
          if (error.response?.status === 422) {
            setErrors(error.response.data?.errors ?? {});
          }
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="fixed top-0 w-full bg-white shadow-md py-3 px-6 flex justify-between items-center z-50">
        <img src="/velveta.png" className="h-14" />
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Create Your Account
          </h2>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 text-red-500 text-sm">
                {Object.values(errors).flat().map((e, i) => (
                  <p key={i}>• {e}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PERSONAL */}
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block mb-2">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="input"
                />
                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={form.newsletter}
                  onChange={handleChange}
                />
                Subscribe newsletter
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                />
                I agree to terms
              </label>

              {/* GOOGLE */}
              <a
                href="http://localhost:8000/auth/google"
                className="flex justify-center items-center gap-2 bg-red-500 text-white py-2 rounded-lg"
              >
                Login with Google
              </a>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="btn-outline"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
