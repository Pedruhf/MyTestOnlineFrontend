import { useContext, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { HiOutlinePlus } from "react-icons/hi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast";
import { api } from "../../config/api";
import { AuthContext } from "../../contexts/AuthContext";
import { CreateQuestionModal } from "./CreateQuestionModal";
import styles from "./styles.module.scss";
import { UpdateQuestionModal } from "./UpdateQuestionModal";

type alternativeProps = {
  _id?: string;
  correct: boolean;
  description: string;
}

type QuestionProps = {
  _id: string;
  title?: string;
  description: string;
  alternatives: alternativeProps[];
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

const Assessment = () => {
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const assessmentId = useParams().id;

  const [assessment, setAssessment] = useState<AssessmentProps>({} as AssessmentProps);
  const [questionToUpdate, setQuestionToUpdate] = useState<QuestionProps>({} as QuestionProps);
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState<boolean>(false);
  const [isUpdateQuestionModalOpen, setIsUpdateQuestionModalOpen] = useState<boolean>(false);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);

  async function getAssessment(): Promise<void> {
    try {
      const res = await api.get(`/assessments/${assessmentId}`, {
        headers: {
          authorization: `bearer ${userToken}`
        },
      });
  
      setAssessment(res.data);
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: "Avaliação não encontrada",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }

  async function handleDeleteQuestion(questionId: string): Promise<void> {
    try {
      await api.delete(`/questions/${questionId}`, {
        headers: {
          authorization: `bearer ${userToken}`
        },
      });

      const toastConfig = {
        type: "success",
        message: "Questão deletada com sucesso",
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);

      getAssessment();
    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: "Erro ao tentar deletar questão",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);
    }
  }

  function handleUpdateQuestion(question: QuestionProps) {
    setQuestionToUpdate(question);
    setIsUpdateQuestionModalOpen(true);
  }

  useEffect(() => {
    getAssessment();
    
    return () => {
      setAssessment({} as AssessmentProps); 
      setToastConfig({} as toastConfig);
      setIsToastVisible(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateQuestionModalOpen, isUpdateQuestionModalOpen]);

  return (
    <main className={styles.main}>
      <div className={styles.assessmentBasicInfo}>
        <h1>{assessment.title}</h1>
        <p>{assessment?.description}</p>
      </div>
      <div className={styles.AssessmentQuestions}>
        {assessment.questions?.map(question => {
          return (
            <div key={question._id} className={styles.AssessmentQuestion}>
              <h1>{question.title}</h1>
              <p>{question.description}</p>
              <div className={styles.questionAlternativesContainer}>
                {question.alternatives.map((alternative, index) => {
                  return (
                    <div key={index} className={styles.questionAlternatives}>
                      <input
                        type="radio"
                        checked={alternative.correct}
                        readOnly
                      />
                      <span>{alternative.description}</span>
                  </div>
                  );
                })}
              </div>
              <div className={styles.controlButtons}>
                <button onClick={() => handleUpdateQuestion(question)}>Editar</button>
                <button onClick={() => handleDeleteQuestion(question._id)}>Excluir</button>
              </div>
            </div>
          );
        })}

        <div onClick={() => setIsCreateQuestionModalOpen(true)} className={styles.createQuestionButton}>
          <span>Criar nova questão</span>
          <HiOutlinePlus />
        </div>
      </div>

      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
      {isCreateQuestionModalOpen && <CreateQuestionModal closeModal={() => setIsCreateQuestionModalOpen(false)} />}
      {isUpdateQuestionModalOpen && <UpdateQuestionModal question={questionToUpdate} closeModal={() => setIsUpdateQuestionModalOpen(false)} />}
    </main>
  );
}

export { Assessment };