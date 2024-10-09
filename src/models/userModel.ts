export interface IUserModel {
  id: string; // PK
  role: number;
  email: string;
  password: string;
  confirmPassword: string;
}
