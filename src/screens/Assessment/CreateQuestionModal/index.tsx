import { FormEvent, useContext, useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { AuthContext } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { api } from "../../../config/api";

import { Toast } from "../../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BiErrorCircle } from "react-icons/bi";

import styles from "./styles.module.scss";

type CreateQuestionModalProps = {
  closeModal: () => void;
}

type alternativeProps = {
  _id?: string;
  correct: boolean;
  description: string;
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

const CreateQuestionModal = ({ closeModal }: CreateQuestionModalProps) => {
  const { userToken } = useContext(AuthContext);
  const assessmentId = useParams().id;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [questionAlternatives, setQuestionAlternatives] = useState<alternativeProps[]>([]);
  
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

  async function handleCreateQuestion(event: FormEvent): Promise<void> {
    event.preventDefault();

    try {
      await api.post("/questions", {
        assessment: assessmentId,
        title,
        description,
        alternatives: questionAlternatives,
      }, {
        headers: {
          authorization: `bearer ${userToken}`,
        },
      },);

      (document.getElementById("createQuestionForm") as HTMLFormElement).reset();
      setTitle("");
      setDescription("");
      setQuestionAlternatives([]);

      const toastConfig = {
        type: "success",
        message: `Questão criada  com sucesso!`,
        icon: <IoIosCheckmarkCircleOutline />,
        position: "right",
        timeout: 6000,
      };

      setToastConfig(toastConfig);
      setIsToastVisible(true);

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
    setModal(document.getElementById("createQuestionModal"));
    document.addEventListener("click", handleCloseModal);

    return () => {
      document.removeEventListener("click", handleCloseModal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <main className={`${styles.modalContainer} ${styles[`modal-${modalSituation}`]}`}>
      <div id="createQuestionModal" className={`${styles.modalCard} ${styles[`modal-${modalSituation}`]}`}>
        <VscClose id="closeButton" onClick={handleCloseModal} />
        <form id="createQuestionForm" onSubmit={handleCreateQuestion}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className={styles.questionAlternativesContainer}>
            {questionAlternatives.map((alternative, index) => {
              return (
                <div key={alternative._id} className={styles.questionAlternatives}>
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
            <button type="button" onClick={handleCreateAlternative}>Nova alternativa</button>
          </div>

          <button type="submit">Concluir</button>
        </form>
      </div>
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { CreateQuestionModal };