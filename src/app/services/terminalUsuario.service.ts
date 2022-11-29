import axios, { AxiosResponse } from 'axios';
import { IRequestBase, ITerminalUsuarios, ITerminalUsuariosFull,  } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/TerminalByUsuarios/";

export function getAllTerminalByUsuariosFull(
    token: string
  ): Promise<AxiosResponse<IRequestBase<ITerminalUsuariosFull[]>>> {
    return http.get<IRequestBase<ITerminalUsuariosFull[]>>(
      `${URL_BASE}GetAllTerminalByUsuariosFull`,
      {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  export function getAllTerminalByUsuarios(
    token: string
  ): Promise<AxiosResponse<IRequestBase<ITerminalUsuarios[]>>> {
    return http.get<IRequestBase<ITerminalUsuarios[]>>(
      `${URL_BASE}GetAllTerminalByUsuarios`,
      {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

export function updateTerminalByUsuario(
    data: ITerminalUsuarios,
    token: string
  ): Promise<AxiosResponse<IRequestBase<null>>> {
    return http.put<IRequestBase<null>>(
      `${URL_BASE}UpdateTerminalByUsuario`,
      {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data : data
      }
    );
  }

export function createTerminalByUsuario(
    data: ITerminalUsuarios,
    token: string
  ): Promise<AxiosResponse<IRequestBase<null>>> {
    return http.post<IRequestBase<null>>(
      `${URL_BASE}CreateTerminalByUsuario`, data,
      {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  export function deleteTerminalByUsuario(
    data: ITerminalUsuarios,
    token: string
  ): Promise<AxiosResponse<IRequestBase<null>>> {
    return http.delete<IRequestBase<null>>(
      `${URL_BASE}DeleteTerminalByUsuario`,
      {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data : data
      }
    );
  }