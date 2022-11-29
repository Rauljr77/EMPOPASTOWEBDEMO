import axios, { AxiosResponse } from 'axios';
import { IRequestBase, ILector } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Lectores/";

export function getAllLectores(token: string): Promise<AxiosResponse<IRequestBase<ILector[]>>> {
  return http.get<IRequestBase<ILector[]>>(`${URL_BASE}GetAllLectores`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
