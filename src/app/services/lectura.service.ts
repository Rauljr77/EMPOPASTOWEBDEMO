import axios, { AxiosResponse } from 'axios';
import { IConsultaRuta, ILecturaDto, IRequestBase, IWriteRuta } from '../types/General';
import { BASE_URL } from '../constants/ConfigApi';

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Lectura/";

export function cargarDetalleLectura(data: ILecturaDto, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CargarDetalleLectura`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function getAllLecturas(token: string): Promise<AxiosResponse<IRequestBase<ILecturaDto[]>>> {
  return http.get<IRequestBase<ILecturaDto[]>>(`${URL_BASE}GetAllLecturas`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function getConsultarRutas(token: string): Promise<AxiosResponse<IRequestBase<IConsultaRuta[]>>> {
  return http.get<IRequestBase<IConsultaRuta[]>>(`${URL_BASE}GetConsultarRutas`, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}

export function writeRutasFromFile(data: IWriteRuta, token: string): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}WriteRutasFromFile`, data, {
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}