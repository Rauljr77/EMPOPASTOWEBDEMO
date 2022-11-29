import { useEffect, useState } from "react";
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
} from "./UserAdminPage.utils";
import { DataGrid, esES } from "@mui/x-data-grid";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import TitlePage from "../../components/common/title/TitlePage";
import {
  IPerfilDto,
  IRequestAuthToken,
  IRequestBase,
  IUsuarioDto,
} from "../../types/General";
import { getAllPerfiles } from "../../services/perfiles.service";
import { AxiosResponse } from "axios";
import { getToken } from "../../services/authToken.service";
import UserModalAdd from "../prueba/userModalAdd";
import { createUsuario, updateUsuario } from "../../services/usuarios.service";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import DialogDefault from "../../components/common/dialog/DialogDefault";
import { IPermiso, usePermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";

const UserAdminPageCopy = () => {
  const [isAllSelect, setAllSelect] = useState<boolean>(true);
  const [isVisibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [isVisibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [isVisibleEliminarDialog, setVisibleEliminarDialog] =
    useState<boolean>(false);
  const [rows, setRows] = useState<IRow[]>([]);
  const [itemSelect, setItemSelect] = useState<IRow>(initItemSelect());
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({});
  const [perfiles, setPerfiles] = useState<IPerfilDto[]>();
  const [permisos, setPermisos] = useState<IPermiso>();

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

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
    setVisibleEdit(true);

    setIsEdit(true);
    if (user) {
      setUser({
        Id: row.id,
        Usu: row.login,
        CodigoInterno: row.codigo,
        Nombre: row.nombreApellido,
        Pa: "",
        Perfil: row.perfilId,
        Activo: row.estadoBoolean,
        numeroDocumento: row.numeroDocumento,
      });
      setVisibleCreate(true);
    }
  };

  const onAllDeletes = async () => {
    setVisibleEliminarDialog(false);
    allDeletes(rows, setRows, setCurrentList);
    setQuery("");
    getAll(setRows, setCurrentList);
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

  const handleNewUser = () => {
    if (!permisos?.crear) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setIsEdit(false);
    setUser({
      Usu: "",
      CodigoInterno: "",
      Nombre: "",
      Pa: "",
      ConfirmarPassword: "",
      numeroDocumento: "",
      Perfil: "",
      Activo: true,
    });
    setVisibleCreate(true);
  };

  const handleSave = async (values: any) => {
    let estado = 0;
    values.Activo ? (estado = 1) : (estado = 0);
    if (!isEdit) {
      let newUser = {
        id: 0,
        codigo: values.CodigoInterno.toUpperCase(),
        numeroDocumento: values.numeroDocumento.toString(),
        login: values.Usu.toUpperCase(),
        password: values.Pa,
        nombreApellido: values.Nombre.toUpperCase(),
        estadoClave: 1,
        intentos: 0,
        tipoDocumentoId: 1,
        perfilId: parseInt(values.Perfil),
        empresaId: 1,
        estado: estado,
        fechaCreacion: "2022-11-01T20:26:25.512Z",
        fechaModificacion: "2022-11-01T20:26:25.512Z",
      };
      let resp = await createUserService(newUser);
      if (resp) {
        if (resp.success) {
          toast.success(resp.message, CONFIG_TOAST);
          setVisibleCreate(false);
          getAll(setRows, setCurrentList);
        } else {
          toast.error(resp.message, CONFIG_TOAST);
        }
      }
    } else {

      let editUser = {
        id: values.Id,
        codigo: values.CodigoInterno.toUpperCase(),
        numeroDocumento: values.numeroDocumento,
        login: values.Usu.toUpperCase(),
        password: values.Pa,
        nombreApellido: values.Nombre.toUpperCase(),
        estadoClave:
          itemSelect?.estadoClave === 0 ? 1 : itemSelect?.estadoClave,
        intentos: itemSelect?.estadoClave === 0 ? 0 : itemSelect?.intentos,
        tipoDocumentoId: 1,
        perfilId: parseInt(values.Perfil),
        empresaId: 1,
        estado: estado,
        fechaCreacion: itemSelect?.fechaCreacion,
        fechaModificacion: itemSelect?.fechaModificacion,
      };
      let resp = await updateUserState(editUser);
      if (resp) {
        if (resp.success) {
          toast.success(resp.message, CONFIG_TOAST);
          setVisibleCreate(false);
          getAll(setRows, setCurrentList);
        } else {
          toast.error(resp.message, CONFIG_TOAST);
        }
      }
    }
  };

  const columns = getColumns(onChangeSelect, onChangeActive, onActionEdit);

  const handleGetAllPerfiles = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IPerfilDto[]>> =
        await getAllPerfiles(_responseAuth.data.token);
      if (_response.data.data) {
        let data = _response.data.data.filter((item) => item.estado === 1);
        let perfilesSort = data.sort(function (a, b) {
          if (a.nombre < b.nombre) {
            return -1;
          }
          if (a.nombre > b.nombre) {
            return 1;
          }
          return 0;
        });
        setPerfiles(perfilesSort);
      }
    }
  };

  const createUserService = async (user: IUsuarioDto) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> = await createUsuario(
        user,
        _responseAuth.data.token
      );
      return _response.data;
    }
  };

  const updateUserState = async (data: IUsuarioDto) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> = await updateUsuario(
        data,
        _responseAuth.data?.token
      );
      return _response.data;
    }
  };

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración Usuario");
      if (resp.status) {
        setPermisos(resp.permiso);
        getAll(setRows, setCurrentList);
        handleGetAllPerfiles();
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
        <TitlePage title="Administración de usuarios" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableComponent
            title="Usuarios"
            textAdd="Nuevo usuario"
            onNew={() => handleNewUser()}
          />
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
            text={`${isAllSelect ? "Seleccionar" : "Deseleccionar"} todos`}
            background="secondary"
            onAction={() =>
              onAllSelect(
                isAllSelect,
                rows,
                currentList,
                setAllSelect,
                setRows,
                setCurrentList
              )
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
      <UserModalAdd
        show={isVisibleCreate}
        handleClose={onCloseModal}
        data={user}
        handleSave={handleSave}
        perfiles={perfiles}
        isEdit={isEdit}
      />
      {/* <CreateProfile 
                isVisible={isVisibleCreate}
                textAcceptButton="Crear perfil"
                textCancelButton="Cancelar"
                onSuccess={onActionModal}
                onCancel={onCloseModal}
            />
            <EditProfile
                isVisible={isVisibleEdit}
                data={itemSelect}
                textAcceptButton="Actualizar perfil"
                textCancelButton="Cancelar"
                onSuccess={onEditRow}
                onCancel={onCloseModal}
        />*/}
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

export default UserAdminPageCopy;
