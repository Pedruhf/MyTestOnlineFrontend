import { IAlternative } from "./alternative";

interface IQuestion {
  _id: string;
  title?: string;
  description: string;
  alternatives: IAlternative[];
  assessment: string;
}

export { IQuestion }