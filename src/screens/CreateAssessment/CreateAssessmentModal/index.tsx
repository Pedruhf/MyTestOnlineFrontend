import { FormEvent, useContext, useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { api } from "../../../config/api";

import { Toast } from "../../../components/Toast";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BiErrorCircle } from "react-icons/bi";

import styles from "./styles.module.scss";
import { AuthContext } from "../../../contexts/AuthContext";

type CreateAssessmentModalProps = {
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

const CreateAssessmentModal = ({ closeModal }: CreateAssessmentModalProps) => {
  const { user, userToken } = useContext(AuthContext);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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

  async function handleCreateAssessment(event: FormEvent): Promise<void> {
    event.preventDefault();

    try {
      await api.post("/assessments", {
        title,
        description,
        user: user?._id,
      }, {
        headers: {
          authorization: `bearer ${userToken}`,
        },
      },
      );

      (document.getElementById("createAssessmentForm") as HTMLFormElement).reset();
      setTitle("");
      setDescription("");

      const toastConfig = {
        type: "success",
        message: `Avaliação criada  com sucesso!`,
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

  useEffect(() => {
    setModal(document.getElementById("createAssessmentModal"));
    document.addEventListener("click", handleCloseModal);

    return () => {
      document.removeEventListener("click", handleCloseModal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <main className={`${styles.modalContainer} ${styles[`modal-${modalSituation}`]}`}>
      <div id="createAssessmentModal" className={`${styles.modalCard} ${styles[`modal-${modalSituation}`]}`}>
        <VscClose id="closeButton" onClick={handleCloseModal} />
        <form id="createAssessmentForm" onSubmit={handleCreateAssessment}>
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
          <button type="submit">Concluir</button>
        </form>
      </div>
      {isToastVisible && <Toast { ...toastConfig } onClose={() => setIsToastVisible(false)} />}
    </main>
  );
}

export { CreateAssessmentModal };