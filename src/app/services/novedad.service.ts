import axios, { AxiosResponse } from "axios";
import { IRequestBase } from "../types/General";
import { BASE_URL } from "../constants/ConfigApi";
import { INovedadDto } from "../types/General";

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Novedades/";

export function getAllNovedades(
  token: string
): Promise<AxiosResponse<IRequestBase<INovedadDto[]>>> {
  return http.get<IRequestBase<INovedadDto[]>>(`${URL_BASE}GetAllNovedades`, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export function createNovedad(
  data: INovedadDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreateNovedad`, data, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export function updateNovedad(
  data: INovedadDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdateNovedad`, data, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};