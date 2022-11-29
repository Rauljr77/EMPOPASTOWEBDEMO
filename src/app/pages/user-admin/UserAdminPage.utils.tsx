import { ESTADO } from "../../constants/Estado";
import {
  IPerfilDto,
  IRequestAuthToken,
  IRequestBase,
  ITerminalUsuarios,
  IUsuarioDto,
} from "../../types/General";
import { AxiosResponse } from "axios";
import { getToken } from "../../services/authToken.service";
import { getAllPerfiles, updatePerfil } from "../../services/perfiles.service";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { KTSVG } from "../../../_metronic/helpers";
import { getAllUsuarios, updateUsuario } from "../../services/usuarios.service";
import { NOMEM } from "dns";
import { number } from "yup";
import { getAllTerminalByUsuarios } from "../../services/terminalUsuario.service";

/**
 * Extiende de la interface IPerfilDto. contiene el campo isSelect para saber si está la fila seleccionada.
 */
export interface IRow extends IUsuarioDto {
  isSelect: boolean; // Sí esta seleccionada la fila
  estadoBoolean: boolean;
  perfil?: string;
}

const FILTER_PARAMETERS: string[] = ["codigo", "nombreApellido", "login"];

const searchParameter = (item: any, query: string): boolean => {
  let isFound: boolean = false;
  FILTER_PARAMETERS.forEach((x: string) => {
    if (item[x].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0)
      isFound = true;
  });
  return isFound;
};

export const search = (
  query: string,
  rows: IRow[],
  setCurrentList: (rows: IRow[]) => void
) => {
  if (query === "") setCurrentList(rows);
  else {
    let _result = rows.filter((x) => searchParameter(x, query));
    setCurrentList(_result);
  }
};

export const initItemSelect = (): IRow => {
  return {
    isSelect: false,
    estadoBoolean: false,
    id: 0,
    codigo: "",
    tipoDocumentoId: 0,
    numeroDocumento: "",
    login: "",
    password: null,
    nombreApellido: "",
    perfilId: 0,
    estado: 0,
    estadoClave: 0,
    fechaCreacion: "",
    fechaModificacion: "",
    intentos: 0,
    empresaId: 0,
    perfil: "",
  };
};

export const getAll = async (
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  const _response: AxiosResponse<IRequestBase<IUsuarioDto[]>> =
    await getAllUsuarios(_responseAuth.data.token);
  if (_response.data.data) {
    const _responsePerfiles: AxiosResponse<IRequestBase<IPerfilDto[]>> =
      await getAllPerfiles(_responseAuth.data.token);
    if (_responsePerfiles.data.data) {
      let data = _responsePerfiles.data.data.filter(
        (item) => item.estado === 1
      );

      const _listFiltered: IUsuarioDto[] = _response.data.data.filter(
        (x: IUsuarioDto) => x.estado !== ESTADO.ELIMINADO
      );
      const _result: IRow[] = _listFiltered.map((item: IUsuarioDto) => ({
        isSelect: false,
        estadoBoolean: item.estado === ESTADO.ACTIVO ? true : false,
        id: item.id,
        codigo: item.codigo,
        tipoDocumentoId: item.tipoDocumentoId,
        numeroDocumento: item.numeroDocumento,
        login: item.login,
        password: item.password,
        nombreApellido: item.nombreApellido,
        perfilId: item.perfilId,
        estado: item.estado,
        estadoClave: item.estadoClave,
        fechaCreacion: item.fechaCreacion,
        fechaModificacion: item.fechaModificacion,
        intentos: item.intentos,
        empresaId: item.empresaId,
        perfil:
          data !== undefined
            ? data.find((e) => e.id === item.perfilId)?.nombre
            : "",
      }));
      setRows(_result);
      setCurrentList(_result);
    }
  }
};

export const onAllSelect = (
  isAllSelect: boolean,
  rows: IRow[],
  currentList: IRow[],
  setAllSelect: (isAllSelect: boolean) => void,
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
): void => {
  let auxOriginal: IRow[] = [...rows];
  let auxCurrent: IRow[] = [...currentList];
  auxOriginal.forEach((element) => {
    element.isSelect = isAllSelect;
  });
  auxCurrent.forEach((element) => {
    element.isSelect = isAllSelect;
  });

  setRows(auxOriginal);
  setCurrentList(auxCurrent);
  setAllSelect(!isAllSelect);
};

export const updateItemInLists = async (
  row: IRow,
  rows: IRow[],
  currentList: IRow[],
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  let auxOriginal: IRow[] = [...rows];
  let auxCurrent: IRow[] = [...currentList];
  let indexOriginal: number = rows.findIndex((x) => x.id === row.id);
  let indexCurrent: number = currentList.findIndex((x) => x.id === row.id);
  auxOriginal[indexOriginal] = row;
  auxCurrent[indexCurrent] = row;
  setRows(auxOriginal);
  setCurrentList(auxCurrent);
};

export const changeActive = async (
  row: IRow,
  checked: boolean,
  rows: IRow[],
  currentList: IRow[],
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data.isAuthSuccessful) {
    row.estadoBoolean = checked;
    row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
    const usuario: IUsuarioDto = {
      id: row.id,
      codigo: row.codigo,
      tipoDocumentoId: row.tipoDocumentoId,
      numeroDocumento: row.numeroDocumento,
      login: row.login,
      password: '',
      nombreApellido: row.nombreApellido,
      perfilId: row.perfilId,
      estado: row.estado,
      estadoClave: row.estadoClave,
      fechaCreacion: row.fechaCreacion,
      fechaModificacion: row.fechaModificacion,
      intentos: row.intentos,
      empresaId: row.empresaId,
    };
    const _response: AxiosResponse<IRequestBase<null>> = await updateUsuario(
      usuario,
      _responseAuth.data.token
    );
    if (_response.data.success) {
      toast.success(
        `Usuario ${row.login} ha sido ${
          row.estado === ESTADO.ACTIVO ? "activado" : "desactivado"
        } con éxito`
      );
      updateItemInLists(row, rows, currentList, setRows, setCurrentList);
    } else
      toast.error(
        `Usuario ${row.login} no se pudo ${
          row.estado === ESTADO.ACTIVO ? "activar" : "desactivar"
        }`,
        CONFIG_TOAST
      );
  } else
    toast.error(
      "Error en la plataforma contáctese con el administrador",
      CONFIG_TOAST
    );
};

const handleGetAllTerminalByUsuarios = async () => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data?.token) {
    const _response: AxiosResponse<IRequestBase<ITerminalUsuarios[]>> =
      await getAllTerminalByUsuarios(_responseAuth.data.token);
    if (_response.data.data) {
      return _response.data;
    }
  }
};

export const allDeletes = async (
  rows: IRow[],
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  /**
   * Bloque carga usuarios.
   */

  // const _responseAuth1: AxiosResponse<IRequestAuthToken> = await getToken();
  // if (_responseAuth1.data.isAuthSuccessful) {
    //const _responseUsers: AxiosResponse<IRequestBase<IUserDto[]>> = await getAllUsuarios(_responseAuth1.data.token);

    // if (_responseUsers.data.data) {
    /**
     * Eliminación
     */
    let flag = false;
    if (rows) {
      const res = await handleGetAllTerminalByUsuarios();
      let inicio = rows.length - 1;
      for (let i = inicio; i >= 0; i--) {
        if (rows[i].isSelect) {
          let foundIndex = res?.data?.findIndex(
            (item) => item.usuarioId === rows[i].id
          );
          if (foundIndex != undefined && foundIndex < 0) {
            const _item: IUsuarioDto = {
              id: rows[i].id,
              codigo: rows[i].codigo,
              tipoDocumentoId: rows[i].tipoDocumentoId,
              numeroDocumento: rows[i].numeroDocumento,
              login: rows[i].login,
              password: rows[i].password,
              nombreApellido: rows[i].nombreApellido,
              perfilId: rows[i].perfilId,
              estado: ESTADO.ELIMINADO,
              estadoClave: rows[i].estadoClave,
              fechaCreacion: rows[i].fechaCreacion,
              fechaModificacion: rows[i].fechaModificacion,
              intentos: rows[i].intentos,
              empresaId: rows[i].empresaId,
            };
            const _responseAuth: AxiosResponse<IRequestAuthToken> =
              await getToken();
            if (_responseAuth.data.isAuthSuccessful) {
              const _response: AxiosResponse<IRequestBase<null>> =
                await updateUsuario(_item, _responseAuth.data.token);
              if (_response.data.success) {
                flag = true;
                toast.success(
                  `código ${rows[i].codigo} login: ${rows[i].login} Eliminado`
                );
              } else {
                toast.error(`No se pudo eliminar el registro con 
                                    código: ${rows[i].codigo} login: ${rows[i].login}`);
              }
            } else {
              toast.error("No se pudo conectar con el servidor", CONFIG_TOAST);
            }
          } else {
            toast.info(
              `Login ${rows[i].login} está asociado, no se puede eliminar`
            );
          }
        }
      }
    }
    if( flag ){
      getAll(setRows, setCurrentList);
    }
    /**
     * Fin bloque eliminación
     */
    // } else {
    //    toast.error("No se pudo conectar con el servidor", CONFIG_TOAST);
    // }
  //}
};

export const createUsuario = (isEdit: boolean, usuario: IUsuarioDto) => {};

export const getColumns = (
  onChangeSelect: (row: IRow, checked: boolean) => void,
  onChangeActive: (row: IRow, checked: boolean) => void,
  onActionEdit: (row: IRow) => void
): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: "isSelect",
      type: "actions",
      headerName: "",
      width: 30,
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="isSelect"
            type="checkbox"
            checked={params.row.isSelect}
            onChange={(e) => onChangeSelect(params.row, e.target.checked)}
          />
        );
      },
    },
    { field: "codigo", headerName: "Código", flex: 1 },
    { field: "login", headerName: "Usuario", flex: 1 },
    { field: "nombreApellido", headerName: "Nombre usuario", flex: 1 },
    { field: "perfil", headerName: "Perfil", flex: 1 },
    {
      field: "estadoBoolean",
      headerName: "Activo",
      width: 130,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="active"
            type="checkbox"
            checked={params.row.estadoBoolean}
            onChange={(e) => onChangeActive(params.row, e.target.checked)}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      type: "actions",
      renderCell: (params) => {
        return (
          <button
            className="btn btn-bg-light btn-active-color-primary btn-sm me-1"
            onClick={() => onActionEdit(params.row)}
          >
            <KTSVG
              path="/media/icons/duotune/art/art005.svg"
              className="svg-icon-3"
            />
            Editar
          </button>
        );
      },
    },
  ];
  return columns;
};
