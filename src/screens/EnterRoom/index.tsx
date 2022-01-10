import { useContext, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast';
import { api } from '../../config/api';
import { AuthContext } from '../../contexts/AuthContext';
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

const EnterRoom = () => {
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  async function getClassroom(): Promise<void> {
    try {
      const res = await api.get(`/classrooms/${roomId}`,
      {
        headers: {
          authorization: `bearer ${userToken}`,
        },
      });

      navigate(`/salas/entrar/${res.data._id}`);
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: error.response.data.error || "Erro ao encontrar sala",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  return (
    <main className={styles.main}>
      <p>Informe o ID da sala</p>
      <div className={styles.controller}>
        <input type="text" value={roomId} onChange={(event) => setRoomId(event.target.value)} />
        <HiOutlineArrowRight onClick={getClassroom} />
      </div>

      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { EnterRoom };