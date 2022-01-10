import { useContext, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { HiOutlinePlus } from "react-icons/hi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toast";
import { api } from "../../config/api";
import { AuthContext } from "../../contexts/AuthContext";
import { CreateAssessmentModal } from "./CreateAssessmentModal";
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

const CreateAssessment = () => {
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isCreateAssessmentModalOpen, setIsCreateAssessmentModalOpen]  = useState<boolean>(false);
  const [assessments, setAssessments] = useState<AssessmentProps[]>([]);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  async function getAssessments(): Promise<void> {
    try {
      const res = await api.get("/assessments", {
        headers: {
          authorization: `bearer ${userToken}`
        },
      });
  
      setAssessments(res.data);
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: "Erro ao tentar carregar avaliações",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);

      navigate("/");
    }
  }

  async function handleDeleteAssessment(assessmentId: string): Promise<void> {
    try {
      await api.delete(`/assessments/${assessmentId}`, {
        headers: {
          authorization: `bearer ${userToken}`
        },
      });

      const toastConfig = {
        type: "success",
        message: "Avaliação deletada com sucesso!",
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);
      
      getAssessments();
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: "Erro ao tentar carregar avaliações",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  useEffect(() => {
    if (!isCreateAssessmentModalOpen) {
      getAssessments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateAssessmentModalOpen]);

  return (
    <main className={styles.main}>
      <h1>Suas avaliações</h1>
      <div className={styles.AssessmentAreaContainer}>
        {assessments.map((assessment: AssessmentProps) => {
          return (
            <div key={assessment._id} className={styles.AssessmentAreaCard}>
              <h1>{assessment.title}</h1>
              <p>{assessment.description}</p>
              <div className={styles.controlButtons}>
                <Link to={`${assessment._id}`}>Abrir</Link>
                <button onClick={() => handleDeleteAssessment(assessment._id)}>Excluir</button>
              </div>
            </div>
          );
        })}

        <div onClick={() => setIsCreateAssessmentModalOpen(true)} className={styles.createAssessmentButton}>
          <span>Criar avaliação</span>
          <HiOutlinePlus />
        </div>
      </div>

      {isCreateAssessmentModalOpen && <CreateAssessmentModal closeModal={() => setIsCreateAssessmentModalOpen(false)} />}
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { CreateAssessment };