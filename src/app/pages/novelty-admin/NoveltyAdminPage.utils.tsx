import { ESTADO } from "../../constants/Estado";
import {
  INovedadDto,
  IRequestAuthToken,
  IRequestBase,
  ITerminal,
  ITerminalUsuarios,
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
import { getAllTerminalByUsuarios } from "../../services/terminalUsuario.service";
import { getAllNovedades, updateNovedad } from "../../services/novedad.service";

/**
 * Extiende de la interface ITerminal. contiene el campo isSelect para saber si está la fila seleccionada.
 */
export interface IRow extends INovedadDto {
  isSelect: boolean; // Sí esta seleccionada la fila
  estadoBoolean: boolean;
  altoBoolean: boolean;
  bajoBoolean: boolean;
  negativoBoolean: boolean;
  ceroBoolean: boolean;
  normalBoolean: boolean;
  sinLecturaBoolean: boolean;
  requiereMensajeBoolean: boolean;
  requiereFotoBoolean: boolean;
}

const FILTER_PARAMETERS: string[] = ["codigo", "nombre"];

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
    nombre: "",
    alto: 0,
    bajo: 0,
    negativo: 0,
    cero: 0,
    normal: 0,
    sinLectura: 0,
    requiereMensaje: 0,
    requiereFoto: 0,
    mensajeId: 0,
    estado: 0,
    fechaCreacion: "",
    fechaModificacion: "",
    altoBoolean: false,
    bajoBoolean: false,
    negativoBoolean: false,
    ceroBoolean: false,
    normalBoolean: false,
    sinLecturaBoolean: false,
    requiereMensajeBoolean: false,
    requiereFotoBoolean: false,
  };
};

export const getAll = async (
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  const _response: AxiosResponse<IRequestBase<INovedadDto[]>> =
    await getAllNovedades(_responseAuth.data?.token);
  if (_response.data.data) {
    //Descartamos las eliminadas o estado == 2
    const _listFiltered: INovedadDto[] = _response.data.data
      .filter((x: INovedadDto) => x.estado !== ESTADO.ELIMINADO)
      .sort(function (a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });
    const _result: IRow[] = _listFiltered.map((item: INovedadDto) => ({
      isSelect: false,
      estadoBoolean: item.estado === ESTADO.ACTIVO ? true : false,
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      alto: item.alto,
      bajo: item.bajo,
      negativo: item.negativo,
      cero: item.cero,
      normal: item.normal,
      sinLectura: item.sinLectura,
      requiereMensaje: item.requiereMensaje,
      requiereFoto: item.requiereFoto,
      mensajeId: item.mensajeId,
      estado: item.estado,
      fechaCreacion: item.fechaCreacion,
      fechaModificacion: item.fechaModificacion,
      altoBoolean: item.alto === ESTADO.ACTIVO ? true : false,
      bajoBoolean: item.bajo === ESTADO.ACTIVO ? true : false,
      negativoBoolean: item.negativo === ESTADO.ACTIVO ? true : false,
      ceroBoolean: item.cero === ESTADO.ACTIVO ? true : false,
      normalBoolean: item.normal === ESTADO.ACTIVO ? true : false,
      sinLecturaBoolean: item.sinLectura === ESTADO.ACTIVO ? true : false,
      requiereMensajeBoolean:
        item.requiereMensaje === ESTADO.ACTIVO ? true : false,
      requiereFotoBoolean: item.requiereFoto === ESTADO.ACTIVO ? true : false,
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
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data.isAuthSuccessful) {
      row.estadoBoolean = checked;
      row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
      const terminal: INovedadDto = {
        id: row.id,
        codigo: row.codigo,
        nombre: row.nombre,
        alto: row.alto,
        bajo: row.bajo,
        negativo: row.negativo,
        cero: row.cero,
        normal: row.normal,
        sinLectura: row.sinLectura,
        estado: row.estado,
        requiereMensaje: row.requiereMensaje,
        requiereFoto: row.requiereFoto,
        mensajeId: row.mensajeId,
        fechaCreacion: row.fechaCreacion,
        fechaModificacion: row.fechaModificacion,
      };
      const _response: AxiosResponse<IRequestBase<null>> = await updateNovedad(terminal, _responseAuth.data.token);
      if (_response.data.success) {
          toast.success(`${row.nombre} ha sido ${row.estado === ESTADO.ACTIVO ? 'activado' : 'desactivado'} con éxito`);
          updateItemInLists(row, rows, currentList, setRows, setCurrentList);
      } else toast.error(`${row.nombre} no se pudo ${row.estado === ESTADO.ACTIVO ? 'activar' : 'desactivar'}`, CONFIG_TOAST);
  } else toast.error("Error en la plataforma contáctese con el administrador", CONFIG_TOAST);
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
        const _item: INovedadDto = {
          id: rows[i].id,
          codigo: rows[i].codigo,
          nombre: rows[i].nombre,
          alto: rows[i].alto,
          bajo: rows[i].bajo,
          negativo: rows[i].negativo,
          cero: rows[i].cero,
          normal: rows[i].normal,
          sinLectura: rows[i].sinLectura,
          requiereMensaje: rows[i].requiereMensaje,
          requiereFoto: rows[i].requiereFoto,
          mensajeId: rows[i].mensajeId,
          estado: ESTADO.ELIMINADO,
          fechaCreacion: rows[i].fechaCreacion,
          fechaModificacion: rows[i].fechaModificacion,
        };
        let resp = await handleUpdateNovedad(_item);
        if (resp?.success) {
          toast.success(`${rows[i].nombre} eliminada`);
        } else {
          toast.error(`No se pudo eliminar el registro ${rows[i].nombre}`);
        }
        getAll(setRows, setCurrentList);
      }
    }
  }
};

export const changeState = async (
  row: IRow,
  checked: boolean,
  op: string,
  rows: IRow[],
  currentList: IRow[],
  setRows: (rows: IRow[]) => void,
  setCurrentList: (rows: IRow[]) => void
) => {
  console.log(row, checked, op);
  let aux = row;
  let newState = 0;
  checked === true ? (newState = 1) : (newState = 0);
  switch (op) {
    case "alto":
      aux.alto = newState;
      break;
    case "bajo":
      aux.bajo = newState;
      break;
    case "negativo":
      aux.negativo = newState;
      break;
    case "cero":
      aux.cero = newState;
      break;
    case "normal":
      aux.normal = newState;
      break;
    case "sinLectura":
      {
        aux.sinLectura = newState;
        if (checked) {
          aux.requiereMensaje = newState;
          aux.requiereFoto = newState;
          aux.alto = 0;
          aux.bajo = 0;
          aux.cero = 0;
          aux.negativo = 0;
          aux.normal = 0;
        }
      }
      break;
    case "requiereMensaje":
      aux.requiereMensaje = newState;
      break;
    case "requiereFoto":
      aux.requiereFoto = newState;
      break;
    case "estado":
      aux.estado = newState;
      break;
  }
  if (
    aux.alto == 1 ||
    aux.bajo == 1 ||
    aux.negativo == 1 ||
    aux.cero == 1 ||
    aux.normal == 1
  ) {
    aux.sinLectura = 0;
  }
  let resp = await handleUpdateNovedad(aux);
  if (resp?.success) {
    toast.success(
      `${checked === true ? "Activado" : "Desactivado"} con éxito`
    );
    getAll(setRows, setCurrentList);
  } else {
    toast.error("Error", CONFIG_TOAST);
  }
};

const handleUpdateNovedad = async (data: INovedadDto) => {
  const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
  if (_responseAuth.data?.token) {
    const _response: AxiosResponse<IRequestBase<null>> = await updateNovedad(
      data,
      _responseAuth.data?.token
    );
    return _response.data;
  }
};

export const getColumns = (
  onChangeSelect: (row: IRow, checked: boolean) => void,
  onChangeActive: (row: IRow, checked: boolean) => void,
  onChangeState: (row: IRow, checked: boolean, op: string) => void,
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
    { field: "nombre", headerName: "Novedad", flex: 1 },
    {
      field: "altoBoolean",
      headerName: "Alto",
      width: 70,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="alto"
            type="checkbox"
            checked={params.row.altoBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "alto")
            }
          />
        );
      },
    },
    {
      field: "bajoBoolean",
      headerName: "Bajo",
      width: 70,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="bajo"
            type="checkbox"
            checked={params.row.bajoBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "bajo")
            }
          />
        );
      },
    },
    {
      field: "negativoBoolean",
      headerName: "Negativo",
      width: 80,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="negativo"
            type="checkbox"
            checked={params.row.negativoBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "negativo")
            }
          />
        );
      },
    },
    {
      field: "ceroBoolean",
      headerName: "Cero",
      width: 70,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="cero"
            type="checkbox"
            checked={params.row.ceroBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "cero")
            }
          />
        );
      },
    },
    {
      field: "normalBoolean",
      headerName: "Normal",
      width: 70,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="normal"
            type="checkbox"
            checked={params.row.normalBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "normal")
            }
          />
        );
      },
    },
    {
      field: "sinLecturaBoolean",
      headerName: "Sin Lectura",
      width: 140,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="sinLectura"
            type="checkbox"
            checked={params.row.sinLecturaBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "sinLectura")
            }
          />
        );
      },
    },
    {
      field: "requiereMensajeBoolean",
      headerName: "Requiere Mensaje",
      width: 140,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="requiereMensaje"
            type="checkbox"
            checked={params.row.requiereMensajeBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "requiereMensaje")
            }
          />
        );
      },
    },
    {
      field: "requiereFotoBoolean",
      headerName: "Requiere Foto",
      width: 140,
      type: "actions",
      editable: true,
      renderCell: (params) => {
        return (
          <input
            className="form-check-input widget-9-check"
            name="requiereFoto"
            type="checkbox"
            checked={params.row.requiereFotoBoolean}
            onChange={(e) =>
              onChangeState(params.row, e.target.checked, "requiereFoto")
            }
          />
        );
      },
    },
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
