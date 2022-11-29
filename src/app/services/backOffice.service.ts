import axios, { AxiosResponse } from 'axios';
import { IRequestBase, ILoginModel, IUsuarioDto, IChangePasswordModel } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const URL_BASE: string = "/BackOffice/";

const http = axios.create({
  baseURL: BASE_URL,
});

export function inicioSesion(data: ILoginModel, token: string): Promise<AxiosResponse<IRequestBase<IUsuarioDto>>> {
  return http.post<IRequestBase<IUsuarioDto>>(`${URL_BASE}InicioSesion`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function cambioPassword(data: IChangePasswordModel, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CambioPassword`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}