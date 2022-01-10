import {  useContext, useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

import { Toast } from '../../components/Toast';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { VscWarning } from "react-icons/vsc";

import clientImg from '../../assets/client.png'
import styles from './styles.module.scss'

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

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [typeActionForRoom, setTypeActionForRoom] = useState<number>(0);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  function handleTypeActionForRoom() {
    typeActionForRoom === 0 ? setTypeActionForRoom(1) : setTypeActionForRoom(0);
  }

  function handleNavigate(route: string): void {
    if (route === "/salas/criar" && !user?.isProfessor) {
      const toastConfig = {
        type: "warning",
        message: "Apenas professores podem criar salas",
        icon: <VscWarning />,
        position: "right",
        timeout: 4000,
      };
      setToastConfig(toastConfig);
      setIsToastVisible(true);
      return;
    }

    navigate(route);
  }

  useEffect(() => {
    return () => {
      setIsToastVisible(false);
    }
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.slogan}>
        <div className={styles.texts}>
          <span>Sua plataforma<br className={styles.brDesktop} /> de <br className={styles.brMobile} /><span>avaliações</span> <br className={styles.brDesktop} />online</span>
          <div className={styles.desktopController}>
          <div onClick={() => handleNavigate("/salas/criar")} className={styles.createRoomButton}>
            <span>Criar sala de avaliaçãoes</span>
            <HiOutlinePlus />
          </div>
          <div onClick={() => handleNavigate("/salas/entrar")} className={styles.enterInExistentRoomButton}>
            <span>Entrar com ID da sala</span>
            <HiOutlineArrowRight />
          </div>
        </div>
        </div>

        <img src={clientImg} alt="client" />
      </div>

      <div className={styles.createRoom}>
        <div className={styles.mobileController}>
          <button onClick={() => handleNavigate(`${typeActionForRoom === 0 ? "/salas/criar" : "/salas/entrar"}`)}>
            {typeActionForRoom === 0 ? <HiOutlinePlus /> : <HiOutlineArrowRight />}
          </button>
          <span>{typeActionForRoom === 0 ? "Entrar em sala existente" : "Criar sua própria sala"}</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={typeActionForRoom === 0} onChange={handleTypeActionForRoom} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <p onClick={handleTypeActionForRoom}>{typeActionForRoom === 0 ? "Entrar em sala existente" : "Criar sua própria sala"}</p>
      </div>

      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  )
}

export { Home }