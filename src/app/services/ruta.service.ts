import axios, { AxiosResponse } from 'axios';
import { IGestionRutas, IRequestBase, IRuta } from '../types/General';
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

export function getRutas(token: string): Promise<AxiosResponse<IRequestBase<IRuta[]>>> {
  return http.get<IRequestBase<IRuta[]>>(`${URL_BASE}GetRutas`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}


export function updateActivarRuta(ruta: IRuta, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdateActivarRuta`, ruta,{
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}