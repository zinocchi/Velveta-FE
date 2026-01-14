  import { useEffect } from "react";
  import { useNavigate } from "react-router-dom";

  const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);
        navigate("/"); // redirect ke home
      } else {
        navigate("/register");
      }
    }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-lg font-semibold">
      Signing you in...
    </div>
  );
};

export default AuthCallback;
