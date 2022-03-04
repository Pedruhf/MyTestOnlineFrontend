import { IQuestion } from "./question";

interface IAssessment {
  _id: string;
  title: string;
  description?: string;
  user: string;
  questions: IQuestion[];
}

export { IAssessment };