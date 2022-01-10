import { FormEvent, useContext, useState } from "react";
import { api } from "../../../config/api";
import { AuthContext } from "../../../contexts/AuthContext";
import { BsEyeSlash, BsEye } from "react-icons/bs";

import { Toast } from "../../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { VscWarning } from "react-icons/vsc";

import styles from "./styles.module.scss";


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

const ChangePassword = () => {
  const { userToken } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();

    try {
      await api.post("/users/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      },
      {
        headers: {
          authorization: `bearer ${userToken}`,
        }
      }
      );

      (document.getElementById('changePasswordForm') as HTMLFormElement).reset();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);

      const toastConfig = {
        type: "success",
        message: "Senha alterada com sucesso!",
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 5000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);

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

  return (
    <div className={styles.content}>
      <form id="changePasswordForm" onSubmit={handleChangePassword}>
        <div className={styles.field}>
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Senha atual"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          {showCurrentPassword ? (<BsEye onClick={() => setShowCurrentPassword(false)} />) : (<BsEyeSlash onClick={() => setShowCurrentPassword(true)} />)}
        </div>
        <div className={styles.field}>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Nova senha"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          {showNewPassword ? (<BsEye onClick={() => setShowNewPassword(false)} />) : (<BsEyeSlash onClick={() => setShowNewPassword(true)} />)}
        </div>
        <div className={styles.field}>
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            placeholder="Confirme a nova senha"
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
          />
          {showConfirmNewPassword ? (<BsEye onClick={() => setShowConfirmNewPassword(false)} />) : (<BsEyeSlash onClick={() => setShowConfirmNewPassword(true)} />)}
        </div>
        <button type="submit">Alterar senha</button>
      </form>

      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </div>
  );
}

export { ChangePassword };