export interface LoginUserForm {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
}
