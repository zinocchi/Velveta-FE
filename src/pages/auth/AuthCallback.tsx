import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api/config";
import { useAuth } from "../../hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      api
        .get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: { data: { user: any } }) => {
          const userData = res.data.user;

          localStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);

          if (userData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/register");
    }
  }, [navigate, setUser]);

  return (
    <div className="flex justify-center items-center h-screen text-lg font-semibold">
      Signing you in...
    </div>
  );
};

export default AuthCallback;