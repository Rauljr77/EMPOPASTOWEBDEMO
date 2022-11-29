import axios, { AxiosResponse } from 'axios';
import { IRequestBase, IUsuarioDto } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const URL_BASE: string = "/Usuario/";

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
    "accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`,
  }
});

export function createUsuario(data: IUsuarioDto): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreateUsuario`, data);
}
