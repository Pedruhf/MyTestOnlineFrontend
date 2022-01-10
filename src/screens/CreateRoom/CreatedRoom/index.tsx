import { useContext, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../../components/Toast";
import { api } from "../../../config/api";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from "./styles.module.scss";

type alternativeProps = {
  _id?: string;
  correct: boolean;
  description: string;
}

type QuestionProps = {
  _id: string;
  title?: string;
  description: string;
  assessment: string;
  alternatives: alternativeProps[];
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

type ClassroomProps = {
  _id: string;
  name: string;
  user: UserProps;
  assessment: AssessmentProps;
};

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

const CreatedRoom = () => {
  const { userToken } = useContext(AuthContext);
  const classroomId = useParams().id;
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<ClassroomProps>();
  const assessment = classroom?.assessment;

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  async function getClassroom(): Promise<void> {
    try {
      const res = await api.get(`/classrooms/${classroomId}`, {
        headers: {
          authorization: `bearer ${userToken}`
        },
      });

      setClassroom(res.data);
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: error.response.data.error || "Avaliação não encontrada",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }
  }

  useEffect(() => {
    getClassroom();
    
    return () => {
      setClassroom({} as ClassroomProps); 
      setToastConfig({} as toastConfig);
      setIsToastVisible(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.roomIdentification}>
        <span>{classroom?.name}</span>
        <span># {classroom?._id}</span>
      </div>
    <div className={styles.content}>
      <h1>{assessment?.title}</h1>
      <p>{assessment?.description}</p>

      <div className={styles.questionsContainer}>
        {assessment?.questions.map(question => {
          return (
            <div key={question._id} className={styles.questionCard}>
              <strong>{question.title}</strong>
              <p>{question.description}</p>
              {question.alternatives.map(alternative => {
                return (
                  <div key={alternative._id} className={styles.alternativesContainer}>
                    <div className={styles.alternativesCard}>
                      <input type="radio" readOnly checked={alternative.correct} />
                      <span>{alternative.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>

    {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
  </main>
  );
}

export { CreatedRoom }