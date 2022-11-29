import axios, { AxiosResponse } from 'axios';
import { IMensajeDto, IRequestBase } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Mensajes/";

export function getAllMensajes(token: string): Promise<AxiosResponse<IRequestBase<IMensajeDto[]>>> {
  return http.get<IRequestBase<IMensajeDto[]>>(
    `${URL_BASE}GetAllMensajes`,   {
      headers: {
        "Content-type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
}

