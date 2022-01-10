import { FormEvent, useContext, useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { api } from "../../../config/api";
import { AuthContext } from "../../../contexts/AuthContext";

import { Toast } from "../../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { VscWarning } from "react-icons/vsc";

import styles from "./styles.module.scss";

type User = {
  email: string,
  name: string,
  age: number,
  isProfessor: boolean;
  picture?: string,
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

const PersonalInfo = () => {
  const { user, setUser, userToken } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState<boolean>();
  const [userEdit, setUserEdit] = useState<User>({} as User);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  function setUserStorage(): void {
    const storageToken = process.env.REACT_APP_STORAGE_TOKEN;
    const storageDataString = localStorage.getItem(`${storageToken}`);

    if (storageDataString) {
      const data = JSON.parse(storageDataString as string);
      localStorage.removeItem(`${storageToken}`);
      localStorage.setItem(`${storageToken}`, JSON.stringify({ user: userEdit, token: userToken, tokenExpires: data.tokenExpires as number }));
      return;
    }

    sessionStorage.removeItem(`${storageToken}`);
    sessionStorage.setItem(`${storageToken}`, JSON.stringify({ user: userEdit, token: userToken }));
    return;
  }

  async function handleUpdateUser(event: FormEvent) {
    event.preventDefault();

    try {
      await api.put("/users", {
        name: userEdit.name,
        email: userEdit.email,
        age: userEdit.age,
        picture: userEdit.picture,
      },
      {
        headers: {
          authorization: `bearer ${userToken}`,
        }
      }
      );
  
      setUser(userEdit);
      setUserStorage();
      setIsEditing(false);

      const toastConfig = {
        type: "success",
        message: "Informações atualizadas com sucesso!",
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

  useEffect(() => {
    setUserEdit(user as User);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },  []);

  return (
    <>
    { !isEditing ?
      (
        <div className={styles.content}>
          { user?.picture ? 
          (
            <img src={user?.picture} alt="MyTestOnline" />
          )
          :
          (
            <div className={styles.defaultAvatar}>
              <FiUser />
            </div>
          )
          }
          <div className={styles.field}>
            <p>Nome:</p>
            <span>{user?.name}</span>
          </div>
          <div className={styles.field}>
            <p>E-mail:</p>
            <span>{user?.email}</span>
          </div>
          <div className={styles.field}>
            <p>Idade:</p>
            <span>{user?.age} anos</span>
          </div>
          <button onClick={() => setIsEditing(true)}>Editar</button>
        </div>
      )
      :
      (
        <div className={styles.content}>
          <form className={styles.editForm} onSubmit={handleUpdateUser}>
            <input
              type="email"
              placeholder="E-mail"
              value={userEdit.email}
              onChange={(event) => setUserEdit({ ...userEdit, email: event.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nome completo"
              value={userEdit.name}
              onChange={(event) => setUserEdit({ ...userEdit, name: event.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Idade"
              value={userEdit.age}
              onChange={(event) => setUserEdit({ ...userEdit, age: Number(event.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Foto (Link)"
              value={userEdit.picture}
              onChange={(event) => setUserEdit({ ...userEdit, picture: event.target.value })}
            />
            <div className={styles.controlButtons}>
              <button type="submit">Salvar</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )
      }

      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </>
  );
}

export { PersonalInfo };