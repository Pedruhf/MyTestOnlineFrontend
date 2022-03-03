import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import { AuthContext } from "../../contexts/AuthContext";

import styles from "./styles.module.scss";

type Alternative = {
  _id: string;
  marked: boolean;
  description: string;
}

type Question = {
  _id: string;
  title?: string;
  description: string;
  alternatives: Alternative[];
}

interface Answer {
  _id?: string;
  user: {
    name: string,
  };
  assessment: string;
  questions: Question[];
  createdAt?: Date | number;
}

const Answers = () => {
  const { userToken } = useContext(AuthContext);
  const assessmentId = useParams().id;
  const [answers, setAnswers] = useState<Answer[]>([]);

  async function getAnswers(): Promise<void> {
    const res = await api.get(`/answers/${assessmentId}`, {
      headers: {
        authorization: `bearer ${userToken}`,
      }
    })
    setAnswers(res.data);
  }

  useEffect(() => {
    getAnswers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.main}>
      {answers.map(answer => {
        return (
          <div key={answer._id} className={styles.answerCard}>
            <h1>{answer.user.name}</h1>
            <div className={styles.questionsContainer}>
              {answer.questions.map(question => {
                return (
                  <div key={question._id} className={styles.questionCard}>
                    <p><strong>{question.title}:</strong> {question.description}</p>
                    
                    <div key={question.description} className={styles.alternativesContainer}>
                      {question.alternatives.map(alternative => {
                        return (
                          <div key={alternative._id} className={styles.alternativeContent}>
                            <input type="radio" readOnly checked={alternative.marked} />
                            <span>{alternative.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </main>
  );
}

export { Answers };