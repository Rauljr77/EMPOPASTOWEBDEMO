import { useEffect, useState } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";
import { FilterTableComponent } from "../../components/table/FilterTableComponent";
import {
  changeActive,
  getAll,
  initItemSelect,
  IRow,
  onAllSelect,
  search,
  updateItemInLists,
  allDeletes,
  getColumns,
} from "./DeviceAdminPage.utils";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import DialogDefault from "../../components/common/dialog/DialogDefault";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import TitlePage from "../../components/common/title/TitlePage";

import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import DeviceModal from "./DeviceModal";
import { IUserDto } from "../../types/GeneralTemp";
import { ILector, IPerfilDto, IRequestAuthToken, IRequestBase, ITerminalUsuarios, ITerminalUsuariosFull } from "../../types/General";
import { AxiosResponse } from "axios";
import { getToken } from "../../services/authToken.service";
import { getAllUsuarios } from "../../services/usuarios.service";
import { getAllLectores } from "../../services/lector.service";
import { getAllPerfiles } from "../../services/perfiles.service";
import { createTerminalByUsuario, deleteTerminalByUsuario, getAllTerminalByUsuariosFull } from "../../services/terminalUsuario.service";

export const DeviceAdminPageCopy = () => {
  const [isVisibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [isVisibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [isVisibleEliminarDialog, setVisibleEliminarDialog] =
    useState<boolean>(false);

  const [permisos, setPermisos] = useState<IPermiso>();
  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  const [rows, setRows] = useState<IRow[]>([]);
  const [itemSelect, setItemSelect] = useState<IRow>(initItemSelect());
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search
  const [userDevice, setUserDevice] = useState({});
  const [dataUser, setDataUser] = useState<IUserDto[]>([]);
  const [dataPerfil, setDataPerfil] = useState<IPerfilDto[]>([]);
  const [dataLector, setDataLector] = useState<ILector[]>([]);
  const [dataTerminalUsuarioFull, setDataTerminalUsuarioFull] = useState<
  ITerminalUsuariosFull[]
>([]);

  const handleGetAllUsuarios = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IUserDto[]>> =
        await getAllUsuarios(_responseAuth.data.token);
      if (_response.data.data) {
        let data = _response.data.data.filter((item) => item.estado === 1);
        setDataUser(data);
      }
    }
  };

  const handleGetAllLectores = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<ILector[]>> =
        await getAllLectores(_responseAuth.data.token);
      if (_response.data.data) {
        let data = _response.data.data.filter((item) => item.estado === 1);
        setDataLector(data);
      }
    }
  };

  const handleGetAllPerfiles = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IPerfilDto[]>> =
        await getAllPerfiles(_responseAuth.data.token);
      if (_response.data.data) {
        let data = _response.data.data
          .filter((item) => item.estado === 1)
          .sort(function (a, b) {
            if (a.nombre < b.nombre) return -1;
            if (a.nombre > b.nombre) return 1;
            return 0;
          });
        setDataPerfil(data);
      }
    }
  };

  const handleGetAllTerminalByUsuariosFull = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<ITerminalUsuariosFull[]>> =
        await getAllTerminalByUsuariosFull(_responseAuth.data.token);
      if (_response.data.data) {
        let data = _response.data.data.filter(
          (item) => item.estado === 1 || item.estado === 0
        );
        setDataTerminalUsuarioFull(data);
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

  const onChangeSelect = (row: IRow, checked: boolean) => {
    row.isSelect = checked;
    updateItemInLists(row, rows, currentList, setRows, setCurrentList);
  };

  const onChangeActive = async (row: IRow, checked: boolean) => {
    await changeActive(
      row,
      checked,
      rows,
      currentList,
      setRows,
      setCurrentList
    );
  };

  const onEditRow = (row: IRow) => {
    updateItemInLists(row, rows, currentList, setRows, setCurrentList);
    setVisibleEdit(false);
  };

  const onActionEdit = (row: IRow) => {
    if (!permisos?.editar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setItemSelect(initItemSelect());
    setItemSelect(row);
    setUserDevice({
      terminalUsuarioId: row.terminalUsuarioId,
      terminalId: row.id,
      nombre: row.nombre,
      numeroSerie: row.numeroSerie,
      usuarioId: row.usuarioId?.toString(),
      asignacion: row.asignacion,
      perfilId: row.perfilId?.toString(),
      lectorId: row.lectorId,
      lector: row.lector,
      estado: row.estado,
    });
    setVisibleEdit(true);
  };

  const onAllDeletes = async () => {
    setVisibleEliminarDialog(false);
    allDeletes(rows, setRows, setCurrentList);
  };

  const onCloseModal = () => {
    setVisibleCreate(false);
    setVisibleEdit(false);
  };

  const onActionModal = (isSuccess: boolean) => {
    if (isSuccess) {
      setVisibleCreate(false);
      setQuery("");
      getAll(setRows, setCurrentList);
    }
  };

  const handleSave = async (values: any) => {
    if (userDevice) {
      if (
        values.perfilId == null ||
        values.perfilId == "0" ||
        values.usuarioId == null ||
        values.usuarioId == "0" ||
        values.lectorId == null ||
        values.lectorId == "0"
      ) {
        toast.error("Debe seleccionar Perfil, Usuario y Lector", CONFIG_TOAST);
      } else {
        if (
          dataTerminalUsuarioFull.find(
            (e) =>
              e.usuarioId == values.usuarioId &&
              e.id != values.terminalUsuarioId &&
              e.estado == 1
          ) != undefined
        ) {
          toast.error("El usuario ya se encuentra asignado", CONFIG_TOAST);
        } 
        else if (
          dataTerminalUsuarioFull.find(
            (e) =>
              e.lectorId == values.lectorId &&
              e.id != values.terminalUsuarioId &&
              e.estado == 1
          ) != undefined
        ) {
          toast.error("El lector ya se encuentra asignado", CONFIG_TOAST);
        }else {
          if (values.idTerminalUsuario != 0) {
            const itemTerUsuFull = dataTerminalUsuarioFull.find(
              (e) => e.id == values.terminalUsuarioId
            );
            let flag = true;
            if (itemTerUsuFull != undefined) {
              let objTerminalUsuario = {
                id: values.terminalUsuarioId,
                usuarioId: itemTerUsuFull.usuarioId,
                terminalId: itemTerUsuFull.terminalId,
                lectorId: itemTerUsuFull.lectorId,
                estado: itemTerUsuFull.estado,
                fechaCreacion: itemTerUsuFull.fechaCreacion,
                fechaModificacion: itemTerUsuFull.fechaModificacion,
              };
              let resp = await handleDeleteTerminalByUsuario(
                objTerminalUsuario
              );
              if (!resp?.data.success) {
                flag = false;
              }
            }
            if (flag) {
              let objTerminalUsuario = {
                id: 0,
                usuarioId: parseInt(values.usuarioId),
                terminalId: parseInt(values.terminalId),
                lectorId:
                  values.lectorId == "0" ? 1 : parseInt(values.lectorId),
                estado: 1,
                fechaCreacion: "2022-10-31T03:53:15.363439Z",
                fechaModificacion: "2022-10-31T15:07:50.131293Z",
              };
              let creado = await handleCreateTerminalByUsuario(
                objTerminalUsuario
              );
              if (creado?.data.success) {
                toast.success(creado.data.message, CONFIG_TOAST);
                onCloseModal();
                getAll(setRows, setCurrentList);
              }
            }
          }
        }
      }
    }
  };

  const columns = getColumns(onChangeSelect, onChangeActive, onActionEdit);

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración de terminales móviles");
      if (resp.status) {
        handleGetAllUsuarios();
        handleGetAllPerfiles();
        handleGetAllLectores();
        handleGetAllTerminalByUsuariosFull();
        setPermisos(resp.permiso);
        getAll(setRows, setCurrentList);
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  useEffect(() => {
    search(query, rows, setCurrentList);
  }, [query]);

  return (
    <>
      <div className="mt-5">
        <TitlePage title="Administración de Asignación de Terminales" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          {/* <HeaderTableComponent
            title="Terminal móvil"
            textAdd="Terminal"
            onNew={() => setVisibleCreate(true)}
          /> */}
          <FilterTableComponent query={query} setQuery={setQuery} />
          <div className="row mx-0 my-3 px-5">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                columns={columns}
                rows={currentList}
                pageSize={5}
                rowsPerPageOptions={[5]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
          </div>
          <ButtonFooterComponent
            text="Seleccionar todo"
            background="secondary"
            onAction={() =>
              onAllSelect(rows, currentList, setRows, setCurrentList)
            }
          />
          <ButtonFooterComponent
            text="Eliminar"
            background="primary"
            onAction={() => {
              if (!permisos?.eliminar) {
                toast.error(
                  "No tiene permiso para ejecutar esta acción",
                  CONFIG_TOAST
                );
                return;
              }
              setVisibleEliminarDialog(true);
            }}
          />
        </div>
      </div>
      {
        isVisibleEdit &&
        <DeviceModal
        show={isVisibleEdit}
        handleClose={onCloseModal}
        data={userDevice}
        handleSave={handleSave}
        users={dataUser}
        perfiles={dataPerfil}
        lectores={dataLector}
      />
      }

      {/* <CreateTerminal
        isVisible={isVisibleCreate}
        textAcceptButton="Crear terminal"
        textCancelButton="Cancelar"
        onSuccess={onActionModal}
        onCancel={onCloseModal}
      />
      <EditTerminal
        isVisible={isVisibleEdit}
        data={itemSelect}
        textAcceptButton="Editar terminal"
        textCancelButton="Cancelar"
        onSuccess={onEditRow}
        onCancel={onCloseModal}
      /> */}
      <DialogDefault
        title="¿Estás seguro de eliminar?"
        isVisible={isVisibleEliminarDialog}
        message="Pulsa en aceptar para continuar, de lo contrario pulse cancelar"
        textAcceptButton="Aceptar"
        textCancelButton="Cancelar"
        type="danger"
        onAccept={() => onAllDeletes()}
        onCancel={() => setVisibleEliminarDialog(false)}
      />
    </>
  );
};

export default DeviceAdminPageCopy;
