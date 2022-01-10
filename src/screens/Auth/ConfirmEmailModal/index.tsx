import { useContext, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Toast } from "../../../components/Toast";
import { api } from "../../../config/api";
import { AuthContext } from "../../../contexts/AuthContext";
import { VscClose } from "react-icons/vsc";
import { BiErrorCircle } from "react-icons/bi";

import styles from "./styles.module.scss";

type registredUser = {
  email: string;
  name: string;
}

type ConfirmEmailModalProps = {
  registredUser: registredUser;
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

const ConfirmEmailModal = ({ registredUser, closeModal }: ConfirmEmailModalProps) => {
  const { userToken } = useContext(AuthContext);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  const [modalSituation, setModalSituation] = useState<string>("opening");

  function handleCloseModal(): void {
    setModalSituation("closing");

    setTimeout(() => {
      closeModal();
    }, 500);
  }

  async function handleResendConfirmationEmail() {
    try {
      await api.post("/users/resend-confirmation-email", {
        email: registredUser.email
      },
      {
        headers: {
          authorization: `bearer ${userToken}`,
        }
      });

      const toastConfig = {
        type: "success",
        message: "E-mail reenviado com sucesso!",
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);
      
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: error.response.data.message || "Erro ao tentar realizar operação",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  return (
    <main className={`${styles.modalContainer}  ${styles[`modal-${modalSituation}`]}`}>
      <div className={`${styles.modalCard}  ${styles[`modal-${modalSituation}`]}`}>
        <VscClose onClick={handleCloseModal} />
        <h1>Olá, {registredUser.name}</h1>
        <h1>Obrigado por se cadastrar em nossa plataforma</h1>
        <h1>Confirme seu e-mail para aproveitar nossas funcionlidades</h1>
        <p>Enviamos um e-mail para <b>{registredUser.email}</b></p>
        <p>Por favor, verifique sua caixa de entrada ou de spam e confirme seu cadastro.</p>
        <p>Não recebeu nosso e-mail? <strong onClick={handleResendConfirmationEmail}>Clique aqui para reenviar</strong></p>
        <span>Certifique-se que confirmou seu e-mail antes tentar fazer login</span>
      </div>

      {isToastVisible && <Toast {...toastConfig} onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { ConfirmEmailModal };