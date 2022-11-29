import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../../services/authToken.service";
import {
  IMensajeDto,
  INovedadDto,
  INovedadForm,
  INovedadMensaje,
  INovedadMensajeFull,
  IRequestAuthToken,
  IRequestBase,
} from "../../types/General";
import NoveltyModal from "./NoveltyModal";
import { NoveltyTable } from "./NoveltyTableComponent";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { toast } from "react-toastify";
import {
  createNovedad,
  getAllNovedades,
  updateNovedad,
} from "../../services/novedad.service";
import NoveltyAddModal from "./NoveltyAddModal";
import {
  createNovedadByMensaje,
  deleteNovedadByMensaje,
  getAllNovedadByMensajesFull,
} from "../../services/novedadMensaje.service";
import { getAllMensajes } from "../../services/mensaje.service";
import { Button } from "react-bootstrap";
import AlertModal from "../../components/common/alert/AlertModal";

import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";

const NoveltyAdminPage = () => {
  /**
   * Inicio: refactorización de código
   */

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [novelty, setNovelty] = useState<INovedadForm>({
    codigo: "",
    nombre: "",
    estado: false,
  });
  const [showNoveltyModal, setShowNoveltyModal] = useState<boolean>(false);
  const handleShowNoveltyModal = () => setShowNoveltyModal(true);
  const handleCloseNoveltyModal = () => setShowNoveltyModal(false);
  const [dataTable, setDataTable] = useState<INovedadDto[]>([]);
  const [filterData, setfilterData] = useState<INovedadDto[]>(dataTable);
  const [id, setId] = useState({});
  const [show, setShow] = useState(false);
  const [novedadMensajes, setNovedadMensajes] =
    useState<INovedadMensajeFull[]>();
  const [mensajes, setMensajes] = useState<IMensajeDto[]>();
  const [novedadMensajeSelected, setNovedadMensajeSelected] =
    useState<IMensajeDto[]>();
  const [showAlert, setShowAlert] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const closeAlert = () => setShowAlert(false);

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();
  const [permisos, setPermisos] = useState<IPermiso>();

  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración de novedades");
      if (resp.status) {
        setPermisos(resp.permiso);
        handleGetAllNovedades();
        handleGetAllNovedadByMensajes();
        handleGetAllMensajes();
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  const handleGetAllNovedadByMensajes = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<INovedadMensajeFull[]>> =
        await getAllNovedadByMensajesFull(_responseAuth.data?.token);
      if (_response.data.data) {
        let data = _response.data.data.filter((item) => item.estado === 1);
        setNovedadMensajes(data);
      } else {
        toast.error("No hay NovedadByMensajes", CONFIG_TOAST);
      }
    }
  };

  const handleGetAllNovedades = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<INovedadDto[]>> =
        await getAllNovedades(_responseAuth.data?.token);
      if (_response.data.data) {
        let data = _response.data.data
          .filter((item) => item.estado === 0 || item.estado === 1)
          .sort(function (a, b) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });

        data.forEach((item) => {
          item.isSelected = false;
        });
        setDataTable(data);
        setfilterData(data);
      }
    }
  };

  const handleGetAllMensajes = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IMensajeDto[]>> =
        await getAllMensajes(_responseAuth.data?.token);
      if (_response.data.data) {
        let data = _response.data.data.filter((item) => item.estado === 1);
        setMensajes(data);
      } else {
        toast.error("Error en la consulta de mensajes", CONFIG_TOAST);
      }
    }
  };

  const handleCreateNovedad = async (data: INovedadDto) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> = await createNovedad(
        data,
        _responseAuth.data?.token
      );
      return _response.data;
    }
  };

  const handleNewNovelty = () => {
    if (!permisos?.crear) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setIsEdit(false);
    setNovelty({
      codigo: "",
      nombre: "",
      estado: false,
    });
    handleShowNoveltyModal();
  };

  const handleSave = async (data: INovedadForm) => {
    let novedad: INovedadDto = {
      id: 0,
      codigo: data.codigo.toUpperCase(),
      nombre: data.nombre.toUpperCase(),
      alto: 0,
      bajo: 0,
      negativo: 0,
      cero: 0,
      normal: 0,
      sinLectura: 0,
      requiereMensaje: 0,
      requiereFoto: 0,
      mensajeId: 0,
      estado: data.estado ? 1 : 0,
      fechaCreacion: "2022-11-10T20:36:46.111203Z",
      fechaModificacion: "2022-11-10T20:36:11.626Z",
    };

    let duplicated = handleDuplicated(0, data.codigo.toUpperCase());
    if (!duplicated) {
      let resp = await handleCreateNovedad(novedad);
      if (resp?.success) {
        toast.success(resp.message, CONFIG_TOAST);
        handleCloseNoveltyModal();
        handleGetAllNovedades();
      }
    } else {
      toast.error("El código ya existe", CONFIG_TOAST);
    }
  };

  const handleEdit = async (id: number) => {
    if (!permisos?.editar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    const data = await dataTable.find((item) => item.id === id);
    if (novedadMensajes) {
      let arrIdMensajes: IMensajeDto[] = [];
      let res = await novedadMensajes.filter((item) => item.novedadId === id);
      if (mensajes) {
        res.forEach((item) => {
          let mensaje = mensajes.find((e) => e.id == item.mensajeId);
          if (mensaje) {
            arrIdMensajes.push(mensaje);
          }
        });
      }
      setNovedadMensajeSelected(arrIdMensajes);
    }
    if (data) {
      setId({
        id: data.id,
        codigo: data.codigo,
        nombre: data.nombre,
        estado: data.estado == 1 ? true : false,
      });
    }
    handleShow();
  };

  const handleSaveJoin = async (values: any, novedad: any) => {
    console.log("A guardar :: ", novedad);
    let duplicated = handleDuplicated(novedad.id, novedad.codigo.toUpperCase());
    if (duplicated) {
      toast.error("El código ya existe", CONFIG_TOAST);
      return;
    }

    if (values.length > 0) {
      if (novedadMensajes) {
        let res = await novedadMensajes.filter(
          (item) => item.novedadId === novedad.id
        );
        for await (const mensajeDelete of res) {
          handleDeleteNovedadByMensaje(mensajeDelete);
        }
      }
      for await (const mensaje of values) {
        const newNovedadMensaje: INovedadMensaje = {
          id: 0,
          novedadId: novedad.id,
          mensajeId: mensaje.id,
          estado: 1,
          fechaCreacion: "2022-10-14T05:26:10.831Z",
          fechaModificacion: "2022-10-14T05:26:10.831Z",
        };
        let resp = await handleCreateNovedadByMensaje(newNovedadMensaje);
        if (resp?.success) {
          toast.success(
            `Mensaje Asociado: ${mensaje.descripcion}`,
            CONFIG_TOAST
          );
        } else {
          toast.error(
            `Error mensaje Asociado: ${mensaje.descripcion}`,
            CONFIG_TOAST
          );
        }
      }
      let aux = [...dataTable];
      const index = aux.findIndex((item) => item.id === novedad.id);
      if (index >= 0) {
        aux[index].codigo = novedad.codigo.toUpperCase();
        aux[index].nombre = novedad.nombre.toUpperCase();
        aux[index].estado = novedad.estado ? 1 : 0;
        let resp = await handleUpdateNovedad(aux[index]);
        if (resp?.success) {
          //toast.success("Registro eliminado ", CONFIG_TOAST);
          //handleGetAllNovedades();
        } else {
          toast.error("Error al actualizar novedad", CONFIG_TOAST);
        }
      }

      toast.success("Registro guardado", CONFIG_TOAST);
      handleGetAllNovedades();
      handleGetAllNovedadByMensajes();
      setShow(false);
    } else {
      toast.error("No hay mensajes seleccionados", CONFIG_TOAST);
    }
  };

  const handleDeleteNovedadByMensaje = async (data: INovedadMensaje) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> =
        await deleteNovedadByMensaje(data, _responseAuth.data?.token);
      if (!_response.data.success) {
        toast.error(
          `Error al eliminar mensaje: mensajeId ${data.mensajeId}`,
          CONFIG_TOAST
        );
      }
    }
  };

  const handleCreateNovedadByMensaje = async (data: INovedadMensaje) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> =
        await createNovedadByMensaje(data, _responseAuth.data?.token);
      return _response.data;
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

  const handleDeleteNovedad = () => {
    if (!permisos?.eliminar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setShowAlert(true);
  };

  const handleResponseAlert = async (option: number) => {
    console.log("Respuesta de la alerta: ", option);
    if (option === 1) {
      //setAllSelected(false);
      let aux = [...dataTable];
      let dataToDelete = aux.filter((item) => item.isSelected === true);
      if (dataToDelete.length > 0) {
        dataToDelete.map((item) => (item.estado = 2));
        for await (const item of dataToDelete) {
          let resp = await handleUpdateNovedad(item);
          if (resp?.success) {
            toast.success("Registro eliminado ", CONFIG_TOAST);
            handleGetAllNovedades();
          } else {
            toast.error("Error", CONFIG_TOAST);
          }
        }
        setShowAlert(false);
        handleGetAllNovedades();
      }
    }
  };

  const handleSearchChange = (value: string) => {
    value = value.toLowerCase();
    let aux = dataTable.filter(
      (item) =>
        item.codigo?.toLowerCase().includes(value) ||
        item.nombre?.toLowerCase().includes(value)
    );
    setfilterData(aux);
  };

  const handleSelected = (id: string, estado: boolean) => {
    //se valida id == 0 para saber si se esta seleccionando todos los registros
    if (id == "0") {
      let aux = [...dataTable];
      aux.forEach((item) => {
        item.isSelected = estado;
      });
      setDataTable(aux);
    } else {
      let aux = [...dataTable];
      const index = aux.findIndex((item) => item.id.toString() === id);
      if (index >= 0) {
        aux[index].isSelected = estado;
        setDataTable(aux);
      }
    }
  };

  const handleDuplicated = (id: number, codigo: string) => {
    let aux = [...dataTable];
    const index = aux.findIndex(
      (item) => item.id !== id && item.codigo === codigo
    );
    if (index >= 0) {
      return true;
    }
    return false;
  };

  /**
   * fIN: refactorización de código
   */

  const handleOnActive = async (id: string, estado: boolean, op: string) => {
    let aux = [...dataTable];
    const index = aux.findIndex((item) => item.id.toString() === id);
    if (index >= 0) {
      let newState = 0;
      estado === true ? (newState = 1) : (newState = 0);
      switch (op) {
        case "alto":
          aux[index].alto = newState;
          break;
        case "bajo":
          aux[index].bajo = newState;
          break;
        case "negativo":
          aux[index].negativo = newState;
          break;
        case "cero":
          aux[index].cero = newState;
          break;
        case "normal":
          aux[index].normal = newState;
          break;
        case "sinLectura":
          {
            aux[index].sinLectura = newState;
            if (estado) {
              aux[index].requiereMensaje = newState;
              aux[index].requiereFoto = newState;
              aux[index].alto = 0;
              aux[index].bajo = 0;
              aux[index].cero = 0;
              aux[index].negativo = 0;
              aux[index].normal = 0;
            }
          }
          break;
        case "requiereMensaje":
          aux[index].requiereMensaje = newState;
          break;
        case "requiereFoto":
          aux[index].requiereFoto = newState;
          break;
        case "estado":
          aux[index].estado = newState;
          break;
      }
      if (
        aux[index].alto == 1 ||
        aux[index].bajo == 1 ||
        aux[index].negativo == 1 ||
        aux[index].cero == 1 ||
        aux[index].normal == 1
      ) {
        aux[index].sinLectura = 0;
      }
      let resp = await handleUpdateNovedad(aux[index]);
      if (resp?.success) {
        toast.success(resp?.message, CONFIG_TOAST);
        handleGetAllNovedades();
      } else {
        toast.error("Error", CONFIG_TOAST);
      }
    }
  };

  return (
    <>
      {/* <InputSearch onChange={handleSearchChange} /> */}
      <br></br>
      <NoveltyTable
        className="card-xxl-stretch mb-12 mb-xl-12"
        dataTable={filterData}
        onActivate={handleOnActive}
        onEdit={handleEdit}
        handleSearchChange={handleSearchChange}
        onNewNovelty={handleNewNovelty}
        onSelected={handleSelected}
      />
      <div className="row mx-5 my-3">
        <div className="col-2">
          <div className="row">
            <Button
              variant="secondary"
              onClick={() => handleSelected("0", true)}
            >
              Seleccionar todo
            </Button>
          </div>
          <br />
          <div className="row">
            <Button variant="primary" onClick={handleDeleteNovedad}>
              Eliminar
            </Button>
          </div>
        </div>
      </div>
      {show && (
        <NoveltyModal
          show={show}
          handleClose={handleClose}
          id={id}
          handleSave={handleSaveJoin}
          novedadMensajes={novedadMensajeSelected}
          mensajes={mensajes}
        />
      )}
      <NoveltyAddModal
        data={novelty}
        show={showNoveltyModal}
        isEdit={isEdit}
        handleClose={handleCloseNoveltyModal}
        onSave={handleSave}
      />
      {showAlert && (
        <AlertModal
          showAlert={showAlert}
          closeAlert={closeAlert}
          responseAlert={handleResponseAlert}
        />
      )}
    </>
  );
};

export default NoveltyAdminPage;
