import axios, { AxiosResponse } from 'axios';
import { IRequestBase, IModuloDto } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Modulos/";

export function getModuloById(id: number, token: string): Promise<AxiosResponse<IRequestBase<IModuloDto>>> {
  return http.get<IRequestBase<IModuloDto>>(`${URL_BASE}GetModuloById?Id=${id}`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function getAllModulos(token: string): Promise<AxiosResponse<IRequestBase<IModuloDto[]>>> {
  return http.get<IRequestBase<IModuloDto[]>>(`${URL_BASE}GetAllModulos`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function createModulo(data: IModuloDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreateModulo`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function updateModulo(data: IModuloDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}UpdateModulo`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function deleteModulo(data: IModuloDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.delete<IRequestBase<null>>(`${URL_BASE}DeleteModulo`, {
    data: data,
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
