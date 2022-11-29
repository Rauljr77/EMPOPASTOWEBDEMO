import axios, { AxiosResponse } from 'axios';
import { IRequestBase, IGestionRutas } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Ruta/";

export function getGestionRutas(token: string): Promise<AxiosResponse<IRequestBase<IGestionRutas[]>>> {
  return http.get<IRequestBase<IGestionRutas[]>>(`${URL_BASE}GetGestionRutas`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
