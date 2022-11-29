import axios, { AxiosResponse } from "axios";
import { IRequestBase, IEmpresaDto } from "../types/General";
import { BASE_URL } from "../constants/ConfigApi";

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Empresas/";

export function getAllEmpresas(
  token: string
): Promise<AxiosResponse<IRequestBase<IEmpresaDto[]>>> {
  return http.get<IRequestBase<IEmpresaDto[]>>(`${URL_BASE}GetAllEmpresas`, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateEmpresa(
  data: IEmpresaDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdateEmpresa`, data, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadLogoEmpresa(
  data: IEmpresaDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}UploadLogoEmpresa`, data, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
