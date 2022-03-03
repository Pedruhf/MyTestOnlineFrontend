import { useContext, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { VscClose } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { Toast } from "../../../components/Toast";
import { api } from "../../../config/api";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from "./styles.module.scss";

type GetAssessmentModalProps = {
  setAssessment: (assessment: AssessmentProps) => void;
  closeModal: () => void;
}

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

const GetAssessmentModal = ({ setAssessment, closeModal }: GetAssessmentModalProps) => {
  const { userToken } = useContext(AuthContext);

  const [modal, setModal] = useState<HTMLElement |  null>();
  const [modalSituation, setModalSituation] = useState<string>("opening");

  const [assessments, setAssessments] = useState<AssessmentProps[]>([]);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  function handleCloseModal(event: any): void {
    if ((modal && !modal.contains(event.target)) || event.target.id === "closeButton" || event.target.parentElement.id === "closeButton") {
      setModalSituation("closing");

      setTimeout(() => {
        closeModal();
      }, 500);
    }
  }

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
    }
  }

  function handleSelectAssessment(assessment: AssessmentProps): void {
    setAssessment(assessment);
    closeModal();
  }

  useEffect(() => {
    setModal(document.getElementById("getAssessmentModal"));
    document.addEventListener("click", handleCloseModal);
    getAssessments();

    return () => {
      document.removeEventListener("click", handleCloseModal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <main className={`${styles.modalContainer} ${styles[`modal-${modalSituation}`]}`}>
      <div id="getAssessmentModal" className={`${styles.modalCard} ${styles[`modal-${modalSituation}`]}`}>
        <VscClose id="closeButton" onClick={handleCloseModal} />
        <h1>Suas avaliações</h1>
        <div className={styles.AssessmentAreaContainer}>
          {assessments.map((assessment: AssessmentProps) => {
            return (
              <div onClick={() => handleSelectAssessment(assessment)} key={assessment._id} className={styles.AssessmentAreaCard}>
                <h1>{assessment.title}</h1>
                <p>{assessment.description}</p>
                <div className={styles.controlButtons}>
                  <Link to={`/avaliacoes/${assessment._id}`}>Abrir</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { GetAssessmentModal };