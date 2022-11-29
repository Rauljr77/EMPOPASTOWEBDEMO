import axios, { AxiosResponse } from 'axios';
import { IRequestBase, IUsuarioDto } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';
import { IUserDto } from '../types/GeneralTemp';


const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Usuario/";

export function getAllUsuarios(token: string): Promise<AxiosResponse<IRequestBase<IUsuarioDto[]>>> {
  return http.get<IRequestBase<IUsuarioDto[]>>(`${URL_BASE}GetAllUsuarios`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function createUsuario(data: IUserDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreateUsuario`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function updateUsuario(data: IUserDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdateUsuario`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
