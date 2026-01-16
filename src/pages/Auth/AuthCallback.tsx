import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../Auth/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();

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
        .then((res) => {
          const userData = res.data.user;

          localStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);
          setIsLoggedIn(true);

          navigate("/");
        })
        .catch(() => {
          navigate("/");
        });
    } else {
      navigate("/register");
    }
  }, [navigate, setUser, setIsLoggedIn]);

  return (
    <div className="flex justify-center items-center h-screen text-lg font-semibold">
      Signing you in...
    </div>
  );
};

export default AuthCallback;
