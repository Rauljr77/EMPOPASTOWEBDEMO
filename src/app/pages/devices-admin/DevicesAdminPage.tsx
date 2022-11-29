import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AlertModal from "../../components/common/alert/AlertModal";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { getToken } from "../../services/authToken.service";
import { getAllLectores } from "../../services/lector.service";
import { getAllPerfiles } from "../../services/perfiles.service";
import { getAllTerminales } from "../../services/terminal.service";
import {
  createTerminalByUsuario,
  deleteTerminalByUsuario,
  getAllTerminalByUsuariosFull,
  updateTerminalByUsuario,
} from "../../services/terminalUsuario.service";
import { getAllUsuarios } from "../../services/usuarios.service";
import {
  IEstadoTerminal,
  ILector,
  IPerfilDto,
  IRequestAuthToken,
  IRequestBase,
  ITerminal,
  ITerminalUsuarios,
  ITerminalUsuariosFull,
} from "../../types/General";
import { IUserDto } from "../../types/GeneralTemp";
import InputSearch from "../prueba/InputSearch";
import DeviceModal from "./DeviceModal";
import { DevicesTable } from "./DevicesTable";

import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";

interface IDataTable {
  terminalUsuarioId: number;
  terminalId: number;
  nombre: string;
  numeroSerie: string;
  usuarioId?: number | null | string;
  asignacion?: string | null;
  perfilId?: number | null | string;
  lectorId?: number | null;
  lector?: string | null;
  estadoTerminal: string;
  estado: boolean;
  isSelected?: boolean;
}

const DevicesAdminPage = () => {
  //----------------- Refactorizacion ------------------------- //
  const [dataUser, setDataUser] = useState<IUserDto[]>([]);
  const [filterDataUser, setfilterDataUser] = useState<IUserDto[]>(dataUser);
  const [dataPerfil, setDataPerfil] = useState<IPerfilDto[]>([]);
  const [dataTerminal, setDataTerminal] = useState<ITerminal[]>([]);
  const [dataLector, setDataLector] = useState<ILector[]>([]);
  const [dataTerminalUsuarioFull, setDataTerminalUsuarioFull] = useState<
    ITerminalUsuariosFull[]
  >([]);
  const [dataTable, setDataTable] = useState<IDataTable[]>();
  const [filterDataTable, setFilterDataTable] = useState<IDataTable[]>();
  const [userDevice, setUserDevice] = useState<IDataTable>();
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const closeAlert = () => setShowAlert(false);

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();
  const [permisos, setPermisos] = useState<IPermiso>();

  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración de terminales móviles");
      if (resp.status) {
        setPermisos(resp.permiso);
        handleGetAllUsuarios();
        handleGetAllPerfiles();
        handleGetAllLectores();
        init();
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  const handleGetAllUsuarios = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IUserDto[]>> =
        await getAllUsuarios(_responseAuth.data.token);
      if (_response.data.data) {
        let data = _response.data.data.filter((item) => item.estado === 1);
        setDataUser(data);
        setfilterDataUser(data);
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

  const handleGetAllTerminales = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<ITerminal[]>> =
        await getAllTerminales(_responseAuth.data.token);
      return _response.data;
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

  const init = async () => {
    let respTer = await handleGetAllTerminales();
    if (respTer?.data) {
      let dataTer = respTer.data.filter((item) => item.estado === 1);
      setDataTerminal(dataTer);
      let respTerUsu = await handleGetAllTerminalByUsuariosFull();
      if (respTerUsu?.data) {
        let dataTerUsuFull = respTerUsu.data.filter(
          (item) => item.estado === 1 || item.estado === 0
        );
        setDataTerminalUsuarioFull(dataTerUsuFull);
        let arrDataTable: IDataTable[] = [];
        for await (const terminal of dataTer) {
          let auxTermUsuFull = dataTerUsuFull.find(
            (e) => e.terminalId == terminal.id
          );
          if (auxTermUsuFull != undefined) {
            arrDataTable.push({
              terminalUsuarioId: auxTermUsuFull.id,
              terminalId: auxTermUsuFull.terminalId,
              nombre: auxTermUsuFull.terminales.nombre,
              numeroSerie: auxTermUsuFull.terminales.numeroSerie,
              usuarioId: auxTermUsuFull.usuarioId,
              asignacion: `${auxTermUsuFull.usuarios.codigo} - ${auxTermUsuFull.usuarios.nombreApellido}`,
              perfilId: auxTermUsuFull.usuarios.perfilId,
              lectorId: auxTermUsuFull.lectorId,
              lector: auxTermUsuFull.lectores.nombre,
              estadoTerminal: "Nuevo",
              estado: auxTermUsuFull.estado == 1 ? true : false,
              isSelected: false,
            });
          } else {
            arrDataTable.push({
              terminalUsuarioId: 0,
              terminalId: terminal.id,
              nombre: terminal.nombre,
              numeroSerie: terminal.numeroSerie,
              usuarioId: 0,
              asignacion: "",
              perfilId: 0,
              lectorId: 0,
              lector: "",
              estadoTerminal: "En reparación",
              estado: false,
              isSelected: false,
            });
          }
        }
        setDataTable(arrDataTable);
        setFilterDataTable(arrDataTable);
      }
    }
  };

  const handleEdit = (id: number) => {
    if (!permisos?.editar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    if (dataTable) {
      const resp = dataTable.find((item) => item.terminalId === id);
      if (resp) {
        setUserDevice({
          terminalUsuarioId: resp.terminalUsuarioId,
          terminalId: resp.terminalId,
          nombre: resp.nombre,
          numeroSerie: resp.numeroSerie,
          usuarioId: resp.usuarioId?.toString(),
          asignacion: resp.asignacion,
          perfilId: resp.perfilId?.toString(),
          lectorId: resp.lectorId,
          lector: resp.lector,
          estadoTerminal: resp.estadoTerminal,
          estado: resp.estado,
          isSelected: resp.isSelected,
        });
      }
      handleShow();
    }
  };

  const handleUpdateTerminalByUsuario = async (data: ITerminalUsuarios) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> =
        await updateTerminalByUsuario(data, _responseAuth.data?.token);
      return _response;
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
        } else if (
          dataTerminalUsuarioFull.find(
            (e) =>
              e.lectorId == values.lectorId &&
              e.id != values.terminalUsuarioId &&
              e.estado == 1
          ) != undefined
        ) {
          toast.error("El lector ya se encuentra asignado", CONFIG_TOAST);
        } else {
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
                handleClose();
                init();
              }
            }
          }
        }
      }
    }
  };

  const handleOnActive = async (id: string, estado: boolean) => {
    if (id === "0") {
      toast.info("La terminal no tiene asignación", CONFIG_TOAST);
    } else {
      let aux = [...dataTerminalUsuarioFull];
      const index = aux.findIndex((item) => item.id.toString() === id);
      if (index >= 0) {
        let newEstado = 0;
        estado === true ? (newEstado = 1) : (newEstado = 0);
        let flag = true;
        if (estado === true) {
          if (dataTerminalUsuarioFull) {
            let usuarioActivo = dataTerminalUsuarioFull.filter(
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
          let objTerminalUsuario = {
            id: aux[index].id,
            usuarioId: aux[index].usuarioId,
            terminalId: aux[index].terminalId,
            lectorId: aux[index].lectorId,
            estado: newEstado,
            fechaCreacion: aux[index].fechaCreacion,
            fechaModificacion: aux[index].fechaModificacion,
          };
          let resp = await handleDeleteTerminalByUsuario(objTerminalUsuario);
          if (resp?.data.success) {
            objTerminalUsuario.id = 0;
            let resp = await handleCreateTerminalByUsuario(objTerminalUsuario);
            if (resp?.data.success) {
              toast.success("Estado actualizado", CONFIG_TOAST);
              init();
            } else {
              toast.error("Ocurrio un error", CONFIG_TOAST);
            }
          }
        }
      }
    }
  };

  const handleSelected = (id: string, estado: boolean, data: IDataTable) => {
    if (id === "0") {
      toast.info("La terminal no tiene asignación", CONFIG_TOAST);
    } else {
      if (dataTable) {
        let aux = [...dataTable];
        const index = aux.findIndex(
          (item) =>
            item.terminalUsuarioId.toString() ===
            data.terminalUsuarioId.toString()
        );
        if (index >= 0) {
          aux[index].isSelected = estado;
          setDataTable(aux);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (!permisos?.eliminar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setShowAlert(true);
  };

  const handleSearchChange = (value: string) => {
    value = value.toLowerCase();
    if (dataTable) {
      let aux = dataTable.filter(
        (item) =>
          item.numeroSerie?.toLowerCase().includes(value) ||
          item.nombre?.toLowerCase().includes(value) ||
          item.asignacion?.toLowerCase().includes(value)
      );
      setFilterDataTable(aux);
    }
  };

  const onResponseAlert = async (option: number) => {
    if (option === 1) {
      if (dataTable) {
        let aux = [...dataTable];
        let itemToDelete = aux.filter((item) => item.isSelected === true);
        if (itemToDelete.length > 0) {
          for await (const item of itemToDelete) {
            let objTerminalUsuario: ITerminalUsuarios = {
              id: item.terminalUsuarioId,
              usuarioId: Number(item.usuarioId),
              terminalId: item.terminalId,
              lectorId: Number(item.lectorId),
              estado: item.estado ? 1 : 0,
              fechaCreacion: "2022-10-31T03:53:15.363439Z",
              fechaModificacion: "2022-10-31T15:07:50.131293Z",
            };
            let resp = await handleDeleteTerminalByUsuario(objTerminalUsuario);
            if (resp?.data.success) {
              toast.success("Registro eliminado", CONFIG_TOAST);
            } else {
              toast.error("Ocurrio un error", CONFIG_TOAST);
            }
          }
          init();
          setShowAlert(false);
        }
      }
    }
  };

  //----------------- Refactorizacion ------------------------- //

  return (
    <>
      <div style={{ marginTop: 50 }}> </div>
      {filterDataTable && (
        <DevicesTable
          className="card-xxl-stretch mb-12 mb-xl-12"
          dataTable={filterDataTable}
          onActivate={handleOnActive}
          onEdit={handleEdit}
          onSelected={handleSelected}
          handleSearchChange={handleSearchChange}
        />
      )}

      {/* {
        filterDataTable && (
          <Pagination itemsPerPage={itemsPerPage} data={filterDataTable.length} pageSelected={pageSelected} />
        )
      } */}

      <Button variant="primary" onClick={handleDelete}>
        Eliminar
      </Button>
      {show && (
        <DeviceModal
          show={show}
          handleClose={handleClose}
          data={userDevice}
          handleSave={handleSave}
          users={dataUser}
          perfiles={dataPerfil}
          lectores={dataLector}
        />
      )}
      {showAlert && (
        <AlertModal
          showAlert={showAlert}
          closeAlert={closeAlert}
          responseAlert={onResponseAlert}
        />
      )}
    </>
  );
};

export default DevicesAdminPage;
