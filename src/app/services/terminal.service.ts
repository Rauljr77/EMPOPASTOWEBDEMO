import axios, { AxiosResponse } from 'axios';
import { IRequestBase, ITerminal, ITerminalDto,  } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Terminales/";

export function getTerminalById(id: number, token: string): Promise<AxiosResponse<IRequestBase<ITerminal>>> {
  return http.get<IRequestBase<ITerminal>>(`${URL_BASE}GetTerminalById?Id=${id}`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

/**
 * @deprecated Está obsoleto, se recomienda usar getAllTerminales
 * @param token Token del servicio
 * @returns Lista de tipo ITerminalDto
 */
export function getAllTerminalesDeprecated(token: string): Promise<AxiosResponse<IRequestBase<ITerminalDto[]>>> {
  return http.get<IRequestBase<ITerminalDto[]>>(`${URL_BASE}GetAllTerminales`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

/**
 * @param token Token del servicio
 * @returns Lista de tipo ITerminal
 */
export function getAllTerminales(token: string): Promise<AxiosResponse<IRequestBase<ITerminal[]>>> {
  return http.get<IRequestBase<ITerminal[]>>(`${URL_BASE}GetAllTerminales`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function createTerminal(data: ITerminal, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreateTerminal`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function updateTerminal(data: ITerminal, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdateTerminal`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function deleteTerminal(data: ITerminal, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.delete<IRequestBase<null>>(`${URL_BASE}DeleteTerminal`, {
    data: data,
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
