import { IAssessment } from "./assessment";
import { IUser } from "./user";

interface IAnswer {
  _id: string;
  user: IUser;
  assessment: IAssessment;
}

export { IAnswer };