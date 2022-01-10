import { FormEvent, useContext, useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { AuthContext } from "../../../contexts/AuthContext";
import { api } from "../../../config/api";

import { Toast } from "../../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BiErrorCircle } from "react-icons/bi";

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
  alternatives: alternativeProps[];
  assessment: string;
  createdAt?: Date | number;
}

type UpdateQuestionModalProps = {
  question: QuestionProps;
  closeModal: () => void;
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

const UpdateQuestionModal = ({ question, closeModal }: UpdateQuestionModalProps) => {
  const { userToken } = useContext(AuthContext);

  const [title, setTitle] = useState<string>(question.title as string);
  const [description, setDescription] = useState<string>(question.description as string);
  const [questionAlternatives, setQuestionAlternatives] = useState<alternativeProps[]>(question.alternatives);
  
  const [modal, setModal] = useState<HTMLElement |  null>();
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<toastConfig>(defaultToastConfig);
  const [modalSituation, setModalSituation] = useState<string>("opening");

  function handleCloseModal(event: any): void {
    if ((modal && !modal.contains(event.target)) || event.target.id === "closeButton" || event.target.parentElement.id === "closeButton") {
      setModalSituation("closing");

      setTimeout(() => {
        closeModal();
      }, 500);
    }
  }

  async function handleUpdateQuestion(event: FormEvent): Promise<void> {
    event.preventDefault();

    try {
      await api.put(`/questions/${question._id}`, {
        title,
        description,
        alternatives: questionAlternatives,
      }, {
        headers: {
          authorization: `bearer ${userToken}`,
        },
      },);

      (document.getElementById("updateQuestionForm") as HTMLFormElement).reset();
      setTitle("");
      setDescription("");
      setQuestionAlternatives([]);

      const toastConfig = {
        type: "success",
        message: `Questão atualizada com sucesso!`,
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 6000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);
      closeModal();

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

  function handleCreateAlternative(): void {
    setQuestionAlternatives([...questionAlternatives, {
      correct: false,
      description: "",
    }]);
  }

  function handleAlternativeCheckModify(index: number, event: React.ChangeEvent<HTMLInputElement>) {
    questionAlternatives.map(alternative => {
      return alternative.correct = false;
    })

    questionAlternatives[index].correct = event.target.checked;
    setQuestionAlternatives([...questionAlternatives]);
  }

  function handleAlternativeDescriptionModify(index: number, event: React.ChangeEvent<HTMLTextAreaElement>) {
    questionAlternatives[index].description =  event.target.value;
    setQuestionAlternatives([...questionAlternatives]);
  }

  useEffect(() => {
    setModal(document.getElementById("updateQuestionModal"));
    document.addEventListener("click", handleCloseModal);

    return () => {
      document.removeEventListener("click", handleCloseModal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <main className={`${styles.modalContainer} ${styles[`modal-${modalSituation}`]}`}>
      <div id="updateQuestionModal" className={`${styles.modalCard} ${styles[`modal-${modalSituation}`]}`}>
        <VscClose id="closeButton" onClick={handleCloseModal} />
        <form id="updateQuestionForm" onSubmit={handleUpdateQuestion}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className={styles.questionAlternativesContainer}>
            {questionAlternatives.map((alternative, index) => {
              return (
                <div key={index} className={styles.questionAlternatives}>
                  <input
                    type="radio"
                    checked={alternative.correct}
                    onChange={(event) => handleAlternativeCheckModify(index, event)}
                  />
                  <textarea
                    placeholder="Alternativa"
                    value={alternative.description}
                    onChange={(event) => handleAlternativeDescriptionModify(index, event)}
                  />
                </div>
              );
            })}
            <button type="button" onClick={handleCreateAlternative}>nova alternativa +</button>
          </div>

          <button type="submit">Concluir</button>
        </form>
      </div>
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { UpdateQuestionModal };