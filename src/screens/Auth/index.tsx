import { FormEvent, useContext, useEffect, useState } from "react";
import { api } from "../../config/api";
import { AuthContext } from "../../contexts/AuthContext";
import { ConfirmEmailModal } from "./ConfirmEmailModal";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

import { Toast } from "../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BiErrorCircle } from "react-icons/bi";
import { VscWarning } from "react-icons/vsc";

import loginImg from "../../assets/loginScreen.svg";
import signupImg from "../../assets/signupScreen.svg";
import styles from "./styles.module.scss";

type userLogin = {
  email: string;
  password: string;
  rememberMe: boolean;
}

const defaultLogin: userLogin = {
  email: "",
  password: "",
  rememberMe: false,
}

type userRegister = {
  email: string;
  name: string;
  age: number | undefined;
  isProfessor: boolean;
  picture?: string;
  password: string;
  confirmPassword: string;
}

const defaultRegister: userRegister = {
  email: "",
  name: "",
  age: undefined,
  isProfessor: false,
  picture: "",
  password: "",
  confirmPassword: "",
}

type toastConfig = {
  type: string;
  message: string;
  icon?: JSX.Element;
  position: string;
  timeout: number;
}

const defaultToastConfig: toastConfig = {
  type: "success",
  message: "Operação realizada com sucesso!",
  icon: <IoIosCheckmarkCircleOutline />,
  position: "left",
  timeout: 4000,
}

const Auth = () => {
  const { signIn } = useContext(AuthContext);
  const [isSignIn, setIsSignIn] = useState(true);
  const [userLogin, setUserLogin] = useState<userLogin>(defaultLogin);
  const [userRegister, setUserRegister] = useState<userRegister>(defaultRegister);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState<boolean>(false);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);
  
  async function handleSignIn(event: FormEvent, userLogin: userLogin): Promise<void> {
    event.preventDefault();
    try {
      await signIn(userLogin);
    } catch (error: any) {
      const toastConfig = {
        type: "warning",
        message: error.response.data.error || "Erro ao tentar realizar operação",
        icon: <VscWarning />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  async function signUp(event: FormEvent) {
    event.preventDefault();
    
    try {
      await api.post("/users", userRegister);

      (document.getElementById("registerForm") as HTMLFormElement).reset();
      const toastConfig = {
        type: "success",
        message: "Cadastro realizado com sucesso!",
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);

      setIsRegisterModalOpen(true);
    } catch (error: any) {
      const toastConfig = {
        type: error.response.data.message ? "warning" : "error",
        message: error.response.data.message || "Erro ao tentar realizar operação",
        icon: error.response.data.message ? <VscWarning /> : <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  function handleCloseModal(): void {
    setIsRegisterModalOpen(false);
    setIsSignIn(true);
  }

  useEffect(() => {
    setUserLogin(defaultLogin);
    setUserRegister(defaultRegister);
  }, [isSignIn]);

  return(
    <main className={styles.container}>
      { isSignIn ? (
      <div className={styles.loginArea}>
        <div className={styles.card}>
          <img src={loginImg} alt="Login Illustration" />
          <div className={styles.loginContainer}>
            <h1>Entrar</h1>
            <form className={styles.fields} onSubmit={(event) => handleSignIn(event, userLogin)}>
              <input 
                type="email" 
                placeholder="E-mail"
                value={userLogin.email}
                onChange={(event) => setUserLogin({ ...userLogin, email: event.target.value })}
                required
              />
              <input 
                type="password"
                placeholder="Senha"
                value={userLogin.password}
                onChange={(event) => setUserLogin({ ...userLogin, password: event.target.value })}
                required
              />
              <div className={styles.rememberMe}>
                <label className={styles.switch}>
                  <input type="checkbox"
                  checked={userLogin.rememberMe}
                  onChange={(event) => setUserLogin({ ...userLogin, rememberMe: event.target.checked })} />
                  <span className={styles.slider}></span>
                </label>
                <span>Lembrar-me</span>
              </div>
              <button type="submit">Entrar</button>
            </form>
            <p>Ainda não possui cadastro? <strong onClick={() => setIsSignIn(false)}>Cadastre-se</strong></p>
            <strong onClick={() => setIsForgotPasswordModalOpen(true)}>Esqueci minha senha</strong>
          </div>
        </div>
      </div>
      ) 
      : 
      (
      <div className={styles.signupArea}>
        <div className={styles.card}>
          <img src={signupImg} alt="SignUp Illustration" />
          <div className={styles.signupContainer}>
            <h1>Cadastrar-se</h1>
            <form id="registerForm" className={styles.fields} onSubmit={signUp}>
              <input
                type="text"
                placeholder="E-mail"
                value={userRegister.email}
                onChange={(event) => setUserRegister({ ...userRegister, email: event.target.value })}
              />
              <input
                type="text"
                placeholder="Nome"
                value={userRegister.name}
                onChange={(event) => setUserRegister({ ...userRegister, name: event.target.value })}
              />
              <input
                type="number"
                placeholder="Idade"
                value={userRegister.age || undefined}
                onChange={(event) => setUserRegister({ ...userRegister, age: Number(event.target.value) })}
              />
              <div className={styles.isProfessorSwitch}>
                <span>Aluno</span>
                <label className={styles.switch}>
                  <input type="checkbox"
                  checked={userRegister.isProfessor}
                  onChange={(event) => setUserRegister({ ...userRegister, isProfessor: event.target.checked })} />
                  <span className={styles.slider} />
                </label>
                <span>Professor</span>
              </div>
              <input
                type="password"
                placeholder="Senha"
                value={userRegister.password}
                onChange={(event) => setUserRegister({ ...userRegister, password: event.target.value })}
              />
              <input
                type="password"
                placeholder="Confirme a senha"
                value={userRegister.confirmPassword}
                onChange={(event) => setUserRegister({ ...userRegister, confirmPassword: event.target.value })}
              />
              <button type="submit">Cadastrar</button>
            </form>
            <p>Já possui cadastro? <strong onClick={() => setIsSignIn(true)}>Fazer Login</strong></p>
          </div>
        </div>
      </div>
      )}

      {isRegisterModalOpen && <ConfirmEmailModal registredUser={userRegister} closeModal={handleCloseModal} />}
      {isForgotPasswordModalOpen && <ForgotPasswordModal closeModal={() => setIsForgotPasswordModalOpen(false)} />}
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { Auth };