export interface LoginObject {
  email: string;
  password: string;
}

export interface RegisterObject {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  username: string;
}
