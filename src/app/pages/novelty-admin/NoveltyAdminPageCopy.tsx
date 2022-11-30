import { useEffect, useState } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";
import { FilterTableComponent } from "../../components/table/FilterTableComponent";
import {
  changeActive,
  changeState,
  getAll,
  initItemSelect,
  IRow,
  onAllSelect,
  search,
  updateItemInLists,
  allDeletes,
  getColumns,
} from "./NoveltyAdminPage.utils";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import DialogDefault from "../../components/common/dialog/DialogDefault";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import TitlePage from "../../components/common/title/TitlePage";

import { usePermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import NoveltyModal from "./NoveltyModal";
import { IMensajeDto, INovedadDto, INovedadForm, INovedadMensaje, INovedadMensajeFull, IRequestAuthToken, IRequestBase } from "../../types/General";
import { AxiosResponse } from "axios";
import { getToken } from "../../services/authToken.service";
import { getAllMensajes } from "../../services/mensaje.service";
import { createNovedadByMensaje, deleteNovedadByMensaje, getAllNovedadByMensajesFull } from "../../services/novedadMensaje.service";
import NoveltyAddModal from "./NoveltyAddModal";
import { createNovedad, updateNovedad } from "../../services/novedad.service";
import { DATAGRID_STYLE } from "../../constants/Styles";

export const NoveltyAdminPageCopy = () => {
  const [isVisibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [isVisibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [isVisibleEliminarDialog, setVisibleEliminarDialog] =
    useState<boolean>(false);

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  const [rows, setRows] = useState<IRow[]>([]);
  const [itemSelect, setItemSelect] = useState<IRow>(initItemSelect());
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search
  const [id, setId] = useState({});
  const [novedadMensajes, setNovedadMensajes] =
    useState<INovedadMensajeFull[]>();
  const [mensajes, setMensajes] = useState<IMensajeDto[]>();
  const [novedadMensajeSelected, setNovedadMensajeSelected] =
  useState<IMensajeDto[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [novelty, setNovelty] = useState<INovedadForm>({
    codigo: "",
    nombre: "",
    estado: false,
  });
  const [isVisibleAdd, setVisibleAdd] = useState<boolean>(false);

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

  const onChangeState = async (row: IRow, checked: boolean, op: string) => {
    await changeState(
      row,
      checked,
      op,
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
    setItemSelect(initItemSelect());
    setItemSelect(row);
    if (novedadMensajes) {
      let arrIdMensajes: IMensajeDto[] = [];
      let res = novedadMensajes.filter((item) => item.novedadId === row.id);
      if (mensajes) {
        console.log('ENTRO A MENSAJES ---------- ');
        res.forEach((item) => {
          let mensaje = mensajes.find((e) => e.id == item.mensajeId);
          if (mensaje) {
            arrIdMensajes.push(mensaje);
          }
        });
      }
      console.log('ARR MENSAJES: ', arrIdMensajes)
      setNovedadMensajeSelected(arrIdMensajes);
    }
      setId({
        id: row.id,
        codigo: row.codigo,
        nombre: row.nombre,
        estado: row.estado == 1 ? true : false,
      });
    //handleShow();
    setVisibleEdit(true);


  };

  const onAllDeletes = async () => {
    setVisibleEliminarDialog(false);
    allDeletes(rows, setRows, setCurrentList);
  };

  const onCloseModal = () => {
    setVisibleCreate(false);
    setVisibleEdit(false);
    setVisibleAdd(false);
  };

  const onActionModal = (isSuccess: boolean) => {
    if (isSuccess) {
      setVisibleCreate(false);
      setQuery("");
      getAll(setRows, setCurrentList);
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

  const handleSaveJoin = async (values: any, novedad: any) => {
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
      let aux = {...itemSelect};

        aux.codigo = novedad.codigo.toUpperCase();
        aux.nombre = novedad.nombre.toUpperCase();
        aux.estado = novedad.estado ? 1 : 0;
        let resp = await handleUpdateNovedad(aux);
        if (resp?.success) {

        } else {
          toast.error("Error al actualizar novedad", CONFIG_TOAST);
        }
      toast.success("Registro guardado", CONFIG_TOAST);
      getAll(setRows, setCurrentList);
      handleGetAllNovedadByMensajes();
      onCloseModal();
    } else {
      toast.error("No hay mensajes seleccionados", CONFIG_TOAST);
    }
  };

  const handleDuplicated = (id: number, codigo: string) => {
    // let aux = [...dataTable];
    // const index = aux.findIndex(
    //   (item) => item.id !== id && item.codigo === codigo
    // );
    // if (index >= 0) {
    //   return true;
    // }
    // return false;
  };

  const handleNewNovelty = () => {
    setIsEdit(false);
    setNovelty({
      codigo: "",
      nombre: "",
      estado: false,
    });
    setVisibleAdd(true);
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

    // let duplicated = handleDuplicated(0, data.codigo.toUpperCase());
    // if (!duplicated) {
      let resp = await handleCreateNovedad(novedad);
      if (resp?.success) {
        toast.success(resp.message, CONFIG_TOAST);
        onCloseModal();
        getAll(setRows, setCurrentList);
       }
    // } else {
    //   toast.error("El código ya existe", CONFIG_TOAST);
    // }
  };

  const columns = getColumns(onChangeSelect, onChangeActive, onChangeState, onActionEdit);

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración de novedades");
      if (resp) {
        handleGetAllNovedadByMensajes();
        handleGetAllMensajes();
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
        <TitlePage title="Administración de Novedades" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableComponent
            title="Novedades"
            textAdd="Novedad"
            onNew={handleNewNovelty}
          />
          <FilterTableComponent query={query} setQuery={setQuery} />
          <div className="row mx-0 my-3 px-5">
            <div
              style={{ height: 400, width: '100%' }}>
              <DataGrid
                sx={DATAGRID_STYLE}
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
            onAction={() => setVisibleEliminarDialog(true)}
          />
        </div>
      </div>
      {isVisibleEdit && (
        <NoveltyModal
          show={isVisibleEdit}
          handleClose={onCloseModal}
          id={id}
          handleSave={handleSaveJoin}
          novedadMensajes={novedadMensajeSelected}
          mensajes={mensajes}
        />
      )}
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
      <NoveltyAddModal
        data={novelty}
        show={isVisibleAdd}
        isEdit={isEdit}
        handleClose={onCloseModal}
        onSave={handleSave}
      />
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

export default NoveltyAdminPageCopy;
