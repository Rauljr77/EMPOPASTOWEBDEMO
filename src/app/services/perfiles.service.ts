import axios, { AxiosResponse } from 'axios';
import { IRequestBase, IPerfilDto } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';
import { toast } from 'react-toastify';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Perfiles/";

export function getPerfilById(id: number, token: string): Promise<AxiosResponse<IRequestBase<IPerfilDto>>> {
  return http.get<IRequestBase<IPerfilDto>>(`${URL_BASE}GetPerfilById?Id=${id}`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function getAllPerfiles(token: string): Promise<AxiosResponse<IRequestBase<IPerfilDto[]>>> {
  return http.get<IRequestBase<IPerfilDto[]>>(`${URL_BASE}GetAllPerfiles`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function createPerfil(data: IPerfilDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreatePerfil`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function updatePerfil(data: IPerfilDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdatePerfil`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function deletePerfil(data: IPerfilDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  toast.info("Eliminación ejecutada");
  return http.delete<IRequestBase<null>>(`${URL_BASE}DeletePerfil`, {
    data: data,
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
