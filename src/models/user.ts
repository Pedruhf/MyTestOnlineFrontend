interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  age: number;
  isProfessor: boolean;
  picture?: string;
}

export { IUser };