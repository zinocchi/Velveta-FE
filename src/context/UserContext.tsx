import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
} | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);


return (
    <UserContext.Provider value={{ user, setUser }}>
      {Children.only(children)}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
};