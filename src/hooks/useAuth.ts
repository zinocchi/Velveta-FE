export const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return {
    isLoggedIn: !!token,
    user: user ? JSON.parse(user) : null,
  };
};
