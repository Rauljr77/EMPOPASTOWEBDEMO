import axios, { AxiosResponse } from 'axios';
import { INovedadMensaje, INovedadMensajeFull, IRequestBase } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/NovedadByMensajes/";

export function getAllNovedadByMensajesFull(token: string): Promise<AxiosResponse<IRequestBase<INovedadMensajeFull[]>>> {
  return http.get<IRequestBase<INovedadMensajeFull[]>>(
    `${URL_BASE}GetAllNovedadByMensajesFull`   ,   {
      headers: {
        "Content-type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
}

export function createNovedadByMensaje(data:INovedadMensaje, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(
    `${URL_BASE}CreateNovedadByMensaje`, data, {
      headers: {
        "Content-type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
}

export function deleteNovedadByMensaje(data:INovedadMensaje, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.delete<IRequestBase<null>>(
    `${URL_BASE}DeleteNovedadByMensaje`   ,{
      headers: {
        "Content-type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      data : data
    });
}
