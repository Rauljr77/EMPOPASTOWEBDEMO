// Services
import { getPermisoAllByIdUser } from "../services/permisos.service";
import { AxiosResponse } from "axios";
import { IRequestAuthToken } from "../types/General";
import { getToken } from "../services/authToken.service";

export interface IPermiso {
  id: number;
  perfilId: number;
  moduloId: number;
  consultar: number;
  crear: number;
  editar: number;
  eliminar: number;
  estado: number;
}

export const usePermiso = () => {
  const getPermiso = async (
    modulo: string
  ): Promise<{ permiso?: IPermiso; status: boolean }> => {
    try {
      const idUser = localStorage.getItem("id_user");

      const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
      const resp = await getPermisoAllByIdUser(
        Number(idUser),
        _responseAuth.data.token
      );

      const arrayPermisos = (resp.data.data as any[]).filter(
        (item) =>
          item.modulos.descripcion === "WEB" && item.modulos.nombre === modulo
      );

      return {
        permiso: arrayPermisos[0],
        status: arrayPermisos.length > 0,
      };
    } catch (error) {
      console.log("Error", error);
      return {
        status: false,
      };
    }
  };

  return { getPermiso };
};
