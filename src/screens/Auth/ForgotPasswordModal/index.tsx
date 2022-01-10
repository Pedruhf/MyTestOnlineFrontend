import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { api } from "../../../config/api";

import { Toast } from "../../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BiErrorCircle } from "react-icons/bi";

import styles from "./styles.module.scss";

type ForgotPasswordModalProps = {
  closeModal: () => void;
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

const ForgotPasswordModal = ({ closeModal }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState<string>("");
  const [modal, setModal] = useState<HTMLElement |  null>();

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);
  const [modalSituation, setModalSituation] = useState<string>("opening");

  function handleCloseModal(event: any): void {
    if ((modal && !modal.contains(event.target)) || event.target.id === "closeButton" || event.target.parentElement.id === "closeButton") {
      setModalSituation("closing");

      setTimeout(() => {
        closeModal();
      }, 500);
    }
  }

  async function handleForgotPassword(): Promise<void> {
    try {
      await api.post("/users/forgot-password", {
        email
      });

      const toastConfig = {
        type: "success",
        message: `Enviamos para ${email} uma solicitação de redifinição de senha`,
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 8000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);

    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: error.response.data.error || "Erro ao tentar realizar operação",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  useEffect(() => {
    setModal(document.getElementById("forgotPasswordModal"));
    document.addEventListener("click", handleCloseModal);

    return () => {
      document.removeEventListener("click", handleCloseModal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <main className={`${styles.modalContainer} ${styles[`modal-${modalSituation}`]}`}>
      <div id="forgotPasswordModal" className={`${styles.modalCard} ${styles[`modal-${modalSituation}`]}`}>
        <VscClose id="closeButton" onClick={handleCloseModal} />
        <h1>Esqueceu sua senha?</h1>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button onClick={handleForgotPassword}>Enviar</button>
      </div>
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { ForgotPasswordModal };