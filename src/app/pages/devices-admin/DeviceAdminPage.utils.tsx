import { ESTADO } from "../../constants/Estado";
import {
  IRequestAuthToken,
  IRequestBase,
  ITerminal,
  ITerminalUsuarios,
  ITerminalUsuariosFull,
} from "../../types/General";
import { AxiosResponse } from "axios";
import { getToken } from "../../services/authToken.service";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { KTSVG } from "../../../_metronic/helpers";
import {
  getAllTerminales,
  updateTerminal,
} from "../../services/terminal.service";
import {
  createTerminalByUsuario,
  deleteTerminalByUsuario,
  getAllTerminalByUsuarios,
  getAllTerminalByUsuariosFull,
} from "../../services/terminalUsuario.service";
import { useState } from "react";

/**
 * Extiende de la interface ITerminal. contiene el campo isSelect para saber si está la fila seleccionada.
 */
export interface IRow extends ITerminal {
  isSelect: boolean; // Sí esta seleccionada la fila
  estadoBoolean: boolean;
  lector?: string;
  lectorId: number;
  asignacion?: string;
  usuarioId: number;
  terminalUsuarioId: number;
  perfilId?: number;
}

const FILTER_PARAMETERS: string[] = ["nombre", "numeroSerie"];

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
    id: 0,
    codigo: "0",
    nombre: "",
    numeroSerie: "",
    estado: 0,
    estadoBoolean: false,
    fechaCreacion: "",
    fechaModificacion: "",
    lector: "",
    lectorId: 0,
    asignacion: "",
    usuarioId: 0,
    terminalUsuarioId: 0,
    perfilId: 0,
  };
};

export const getAll = async (
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  const _response: AxiosResponse<IRequestBase<ITerminal[]>> =
    await getAllTerminales(_responseAuth.data.token);
  if (_response.data.data) {
    //Descartamos las eliminadas o estado == 2
    const _responseTerminalUsers = await handleGetAllTerminalByUsuariosFull();
    let flag = false;
    let aux: any = [];
    if (_responseTerminalUsers?.data) {
      aux = _responseTerminalUsers?.data.map((item) => ({
        terminalId: item.terminalId,
        asignacion: item.usuarios.codigo + " - " + item.usuarios.nombreApellido,
        usuarioId: item.usuarioId,
        estado: item.estado,
        terminalUsuarioId: item.id,
        perfilId: item.usuarios.perfilId,
        lectorId: item.lectorId,
      }));
      flag = true;
    }

    const _listFiltered: ITerminal[] = _response.data.data.filter(
      (x: ITerminal) => x.estado === ESTADO.ACTIVO
    );
    const _result: IRow[] = _listFiltered.map((item: ITerminal) => ({
      isSelect: false,
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      numeroSerie: item.numeroSerie,
      estado:
        flag && aux?.find((e: any) => e.terminalId === item.id)?.estado
          ? aux?.find((e: any) => e.terminalId === item.id)?.estado
          : 0,
      estadoBoolean:
        flag && aux?.find((e: any) => e.terminalId === item.id)?.estado == 1
          ? true
          : false,
      fechaCreacion: item.fechaCreacion,
      fechaModificacion: item.fechaModificacion,
      lector:
        flag &&
        _responseTerminalUsers?.data?.find((e) => e.terminalId === item.id)
          ?.lectores.nombre
          ? _responseTerminalUsers?.data?.find((e) => e.terminalId === item.id)
              ?.lectores.nombre
          : "",
      lectorId:
        flag && aux?.find((e: any) => e.terminalId === item.id)?.lectorId
          ? aux?.find((e: any) => e.terminalId === item.id)?.lectorId
          : 0,
      asignacion:
        flag && aux?.find((e: any) => e.terminalId === item.id)?.asignacion
          ? aux?.find((e: any) => e.terminalId === item.id)?.asignacion
          : "",
      usuarioId:
        flag && aux?.find((e: any) => e.terminalId === item.id)?.usuarioId
          ? aux?.find((e: any) => e.terminalId === item.id)?.usuarioId
          : 0,
      terminalUsuarioId:
        flag &&
        aux?.find((e: any) => e.terminalId === item.id)?.terminalUsuarioId
          ? aux?.find((e: any) => e.terminalId === item.id)?.terminalUsuarioId
          : 0,
      perfilId:
        flag && aux?.find((e: any) => e.terminalId === item.id)?.perfilId
          ? aux?.find((e: any) => e.terminalId === item.id)?.perfilId
          : 0,
    }));
    setRows(_result);
    setCurrentList(_result);
  }
};

export const onAllSelect = (
  rows: IRow[],
  currentList: IRow[],
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
): void => {
  let auxOriginal: IRow[] = [...rows];
  let auxCurrent: IRow[] = [...currentList];
  auxOriginal.forEach((element) => {
    element.isSelect = true;
  });
  auxCurrent.forEach((element) => {
    element.isSelect = true;
  });
  setRows(auxOriginal);
  setCurrentList(auxCurrent);
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
  if (row.terminalUsuarioId === 0) {
    toast.info(`Terminal ${row.nombre} no está asociado, no se puede activar`);
  } else {
    const _responseTerminalUsers = await handleGetAllTerminalByUsuariosFull();
    if (_responseTerminalUsers?.data) {
      let aux = [..._responseTerminalUsers?.data];
      const index = aux.findIndex((item) => item.id === row.terminalUsuarioId);

      if (index >= 0) {
        let flag = true;
        if (checked === true) {
          if (aux) {
            let usuarioActivo = aux.filter(
              (item) =>
                (item.usuarioId === aux[index].usuarioId &&
                  item.estado === 1) ||
                (item.lectorId === aux[index].lectorId && item.estado === 1)
            );
            if (usuarioActivo.length > 0) {
              toast.info(
                "El usuario y/o el lector ya tienen asignada una terminal",
                CONFIG_TOAST
              );
              flag = false;
            }
          }
        }
        if (flag) {
          let newEstado = 0;
          row.estadoBoolean = checked;
          row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
          checked === true ? (newEstado = 1) : (newEstado = 0);

          let objTerminalUsuario = {
            id: row.terminalUsuarioId,
            usuarioId: row.usuarioId,
            terminalId: row.id,
            lectorId: row.lectorId,
            estado: newEstado,
            fechaCreacion: row.fechaCreacion,
            fechaModificacion: row.fechaModificacion,
          };
          let resp = await handleDeleteTerminalByUsuario(objTerminalUsuario);
          if (resp?.data.success) {
            objTerminalUsuario.id = 0;
            let resp = await handleCreateTerminalByUsuario(objTerminalUsuario);
            if (resp?.data.success) {
              toast.success(
                `Asignación a Terminal ${row.nombre} ha sido ${
                  row.estado === ESTADO.ACTIVO ? "activado" : "desactivado"
                } con éxito`
              );
              getAll(setRows, setCurrentList);
            } else {
              toast.error(
                `Terminal ${row.nombre} no se pudo ${
                  row.estado === ESTADO.ACTIVO ? "activar" : "desactivar"
                }`,
                CONFIG_TOAST
              );
            }
          }
        }
      }
    }
  }
};

const handleCreateTerminalByUsuario = async (data: ITerminalUsuarios) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data?.token) {
    const _response: AxiosResponse<IRequestBase<null>> =
      await createTerminalByUsuario(data, _responseAuth.data?.token);
    return _response;
  }
};

const handleDeleteTerminalByUsuario = async (data: ITerminalUsuarios) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data?.token) {
    const _response: AxiosResponse<IRequestBase<null>> =
      await deleteTerminalByUsuario(data, _responseAuth.data?.token);
    return _response;
  }
};

export const allDeletes = async (
  rows: IRow[],
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  if (rows.length > 0) {
    let inicio = rows.length - 1;
    for (let i = inicio; i >= 0; i--) {
      if (rows[i].isSelect) {
        if (rows[i].terminalUsuarioId !== 0) {
          const _item: ITerminalUsuarios = {
            id: rows[i].terminalUsuarioId,
            usuarioId: rows[i].usuarioId,
            lectorId: rows[i].lectorId,
            terminalId: rows[i].id,
            estado: ESTADO.ELIMINADO,
            fechaCreacion: rows[i].fechaCreacion,
            fechaModificacion: rows[i].fechaModificacion,
          };

          const _responseAuth: AxiosResponse<IRequestAuthToken> =
            await getToken();
          if (_responseAuth.data.isAuthSuccessful) {
            const _response: AxiosResponse<IRequestBase<null>> =
              await deleteTerminalByUsuario(_item, _responseAuth.data.token);
            if (_response.data.success) {
              toast.success(
                `Asignación a terminal: ${rows[i].nombre} eliminada`
              );
              getAll(setRows, setCurrentList);
            } else {
              toast.error(`No se pudo eliminar el registro con 
                                    número serie: ${rows[i].numeroSerie} nombre: ${rows[i].nombre}`);
            }
          } else toast.error("Error de conexión", CONFIG_TOAST);
        } else {
          toast.info(
            `Terminal ${rows[i].nombre} no está asociado, no se puede eliminar`
          );
        }
      }
    }
  }
};

const handleGetAllTerminalByUsuariosFull = async () => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data?.token) {
    const _response: AxiosResponse<IRequestBase<ITerminalUsuariosFull[]>> =
      await getAllTerminalByUsuariosFull(_responseAuth.data.token);
    if (_response.data.data) {
      return _response.data;
    }
  }
};

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
    { field: "numeroSerie", headerName: "Número de serie", flex: 1 },
    { field: "nombre", headerName: "Nombre Terminal", flex: 1 },
    { field: "asignacion", headerName: "Asignación", flex: 1 },
    { field: "lector", headerName: "Lector asociado", flex: 1 },
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
            Asignar
          </button>
        );
      },
    },
  ];
  return columns;
};
