import axios, { AxiosResponse } from 'axios';
import { IRequestBase, IEstadoTerminal } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/EstadoTerminales/";

export function getEstadoTerminalById(id: number, token: string): Promise<AxiosResponse<IRequestBase<IEstadoTerminal>>> {
  return http.get<IRequestBase<IEstadoTerminal>>(`${URL_BASE}GetEstadoTerminalById?Id=${id}`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function getAllEstadoTerminales(token: string): Promise<AxiosResponse<IRequestBase<IEstadoTerminal[]>>> {
  return http.get<IRequestBase<IEstadoTerminal[]>>(`${URL_BASE}GetAllEstadoTerminales`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function createEstadoTerminal(data: IEstadoTerminal, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreateEstadoTerminal`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function updateEstadoTerminal(data: IEstadoTerminal, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}UpdateEstadoTerminal`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function deleteEstadoTerminal(data: IEstadoTerminal, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.delete<IRequestBase<null>>(`${URL_BASE}DeleteEstadoTerminal`, {
    data: data,
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
