import { useContext, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { HiOutlinePlus } from 'react-icons/hi';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast';
import { api } from '../../config/api';
import { AuthContext } from '../../contexts/AuthContext';
import { GetAssessmentModal } from './GetAssessmentModal';

import styles from "./styles.module.scss";

type QuestionProps = {
  _id: string;
  title?: string;
  description: string;
  assessment: string;
  createdAt?: Date | number;
}
type UserProps = {
  _id: string;
  email: string;
  password: string;
  name: string;
  age: number;
  picture?: string;
  createdAt?: Date | number;
}

type AssessmentProps = {
  _id: string;
  title: string;
  description?: string;
  user: UserProps;
  questions: QuestionProps[];
  createdAt?: Date | number;
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

const CreateRoom = () => {
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState<string>("");
  const [assessment, setAssessment] = useState<AssessmentProps>();  
  
  const [isAssessmentsModalOpen, setIsAssessmentsModalOpen] = useState<boolean>(false);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  async function handleCreateRoom(): Promise<void> {
    try {
      const res = await api.post("/classrooms", {
        name,
        assessment: assessment?._id,
      },
      {
        headers: {
          authorization: `bearer ${userToken}`,
        },
      });

      navigate(`/salas/criar/${res.data._id}`);
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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p>Informe o nome da sala</p>
        <div className={styles.controller}>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
          <HiOutlinePlus onClick={handleCreateRoom} />
        </div>
        <button onClick={() => setIsAssessmentsModalOpen(true) }>{assessment?.title || "Selecionar avaliação"}</button>
      </div>

      {isAssessmentsModalOpen &&
        <GetAssessmentModal
          closeModal={() => setIsAssessmentsModalOpen(false)}
          setAssessment={setAssessment}
        />
      }
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { CreateRoom };