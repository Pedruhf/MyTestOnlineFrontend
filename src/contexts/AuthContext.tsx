import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";

type User = {
  _id?: string;
  email: string,
  name: string,
  age: number,
  isProfessor: boolean;
  picture?: string,
}

type UserLogin = {
  email: string;
  password: string;
  rememberMe: boolean;
}

type AuthContextType = {
  user: User | undefined;
  userToken: string | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setUserToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  signIn: (userLogin: UserLogin) => Promise<void>;
  signOut: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

function AuthContextProvider(props: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [userToken, setUserToken] = useState<string>();

  async function signIn(userLogin: UserLogin): Promise<void> {
    const token = process.env.REACT_APP_STORAGE_TOKEN;
    const res = await api.post("/users/login", userLogin);
    
    setUser(res.data.user);
    setUserToken(res.data.token);

    if (userLogin.rememberMe) {
      res.data.tokenExpires = ((Number(new Date())) / 1000) + 86400;
      localStorage.setItem(`${token}`, JSON.stringify(res.data));
    } else {
      sessionStorage.setItem(`${token}`, JSON.stringify(res.data));
    }

    return navigate("/");
  }

  function signOut(): void {
    const token = process.env.REACT_APP_STORAGE_TOKEN;
    localStorage.removeItem(`${token}`);
    sessionStorage.removeItem(`${token}`);

    setUser(undefined);
    setUserToken(undefined);

    navigate("/auth");
  }

  return(
    <AuthContext.Provider value={{ user, setUser, userToken, setUserToken, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };