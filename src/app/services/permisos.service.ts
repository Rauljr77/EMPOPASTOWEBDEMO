import axios, { AxiosResponse } from "axios";
import { IRequestBase, IPermisoDto, IPermisoFullDto } from "../types/General";
import { BASE_URL } from "../constants/ConfigApi";

const http = axios.create({
  baseURL: BASE_URL,
});

const URL_BASE: string = "/Permisos/";

export function getPermisoById(
  id: number,
  token: string
): Promise<AxiosResponse<IRequestBase<IPermisoDto>>> {
  return http.get<IRequestBase<IPermisoDto>>(
    `${URL_BASE}GetPermisoById?Id=${id}`,
    {
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

//Método se eliminará
export function getAllPermisos(
  token: string
): Promise<AxiosResponse<IRequestBase<IPermisoDto[]>>> {
  return http.get<IRequestBase<IPermisoDto[]>>(`${URL_BASE}GetAllPermisos`, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
//Fin método se eliminará

export function getAllPermisosFull(
  token: string
): Promise<AxiosResponse<IRequestBase<IPermisoFullDto[]>>> {
  return http.get<IRequestBase<IPermisoFullDto[]>>(
    `${URL_BASE}GetAllPermisosFull`,
    {
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function createPermiso(
  data: IPermisoDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.post<IRequestBase<null>>(`${URL_BASE}CreatePermiso`, data, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updatePermiso(
  data: IPermisoDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.put<IRequestBase<null>>(`${URL_BASE}UpdatePermiso`, data, {
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deletePermiso(
  data: IPermisoDto,
  token: string
): Promise<AxiosResponse<IRequestBase<null>>> {
  return http.delete<IRequestBase<null>>(`${URL_BASE}DeletePermiso`, {
    data: data,
    headers: {
      "Content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getPermisoAllByIdUser(
  idUser: number,
  token: string
): Promise<AxiosResponse<IRequestBase<Object>>> {
  return http.get<IRequestBase<Object>>(
    `${URL_BASE}GetAllFullByIdUsuario?id=${idUser}`,
    {
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
