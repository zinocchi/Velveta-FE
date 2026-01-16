import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../Auth/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth(); // Tambahkan setIsLoggedIn

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
          
          // SIMPAN KE LOCALSTORAGE juga
          localStorage.setItem("user", JSON.stringify(userData));
          
          // Update state auth
          setUser(userData);
          setIsLoggedIn(true); // TAMBAHKAN INI
          
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