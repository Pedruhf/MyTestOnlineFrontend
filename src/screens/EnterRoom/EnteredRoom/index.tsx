import { FormEvent, useContext, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../../components/Toast";
import { api } from "../../../config/api";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from "./styles.module.scss";

type alternativeProps = {
  _id?: string;
  marked: boolean;
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

const EnteredRoom = () => {
  const { userToken } = useContext(AuthContext);
  const classroomId = useParams().id;
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<ClassroomProps>({} as ClassroomProps);
  const assessment = classroom?.assessment;
  const [questions, setQuestions] = useState<QuestionProps[]>([]);

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
      setQuestions(res.data.assessment.questions);
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

  function handleMarkAlternative(question: QuestionProps, index: number, event:React.ChangeEvent<HTMLInputElement>): void {
    question.alternatives.map(alternative => alternative.marked = false);

    const questionIndex = questions?.findIndex(element => element._id === question._id) as number;
    if (questionIndex < 0) {
      return;
    }

    question.alternatives[index].marked = event.target.checked;
    (questions as QuestionProps[])[questionIndex] = question;

    setQuestions([...questions as QuestionProps[]]);
  }

  async function handleSendAnswers(event: FormEvent): Promise<void> {
    event.preventDefault();

    try {
      await api.post("/answers", {
        assessment: assessment._id,
        questions: questions,
      },
      {
        headers: {
          authorization: `bearer ${userToken}`
        },
      });

      const toastConfig = {
        type: "success",
        message: "Respostas enviadas com sucesso",
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);

      setTimeout(() => {
        navigate("/");
      }, 4000);

    } catch (error: any) {
      const toastConfig = {
        type: "error",
        message: error.response.data.error || "Erro ao enviar respostas",
        icon: <BiErrorCircle />,
        position: "right",
        timeout: 4000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);
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
        <span>{classroom?._id}</span>
      </div>
    <div className={styles.content}>
      <h1>{assessment?.title}</h1>
      <p>{assessment?.description}</p>

      <form className={styles.questionsContainer} onSubmit={handleSendAnswers}>
        {questions?.map(question => {
          return (
            <div key={question._id} className={styles.questionCard}>
              <strong>{question.title}</strong>
              <p>{question.description}</p>
              {question.alternatives.map((alternative, index)=> {
                return (
                  <div key={alternative._id} className={styles.alternativesContainer}>
                    <div className={styles.alternativesCard}>
                      <input
                      type="radio"
                      checked={alternative.marked}
                      onChange={(event) => handleMarkAlternative(question, index, event)}
                      />
                      <span>{alternative.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <button type="submit">Enviar</button>
      </form>

    </div>

    {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
  </main>
  );
}

export { EnteredRoom }