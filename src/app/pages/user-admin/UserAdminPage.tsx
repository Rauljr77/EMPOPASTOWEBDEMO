import axios, { AxiosResponse } from "axios";

import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getToken } from "../../services/authToken.service";
import {
  IRequestAuthToken,
  IPerfilDto,
  IRequestBase,
  ITerminalUsuarios,
} from "../../types/General";
import { IUserDto } from "../../types/GeneralTemp";
import {
  getAllUsuarios,
  updateUsuario,
  createUsuario,
} from "../../services/usuarios.service";
import { getAllPerfiles } from "../../services/perfiles.service";
import UserModalAdd from "../prueba/userModalAdd";
import { UserTable } from "../prueba/UserTableComponent";
import AlertModal from "../../components/common/alert/AlertModal";
import { Pagination } from "../../components/pagination/PaginationComponent";
import { getAllTerminalByUsuarios } from "../../services/terminalUsuario.service";

import { usePermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";

interface IUser extends IUserDto {
  selected?: boolean | null;
}

const UserAdminPage = () => {
  /**
   * Inicio: refactorización de código
   */
  const [dataUsers, setDataUsers] = useState<IUser[]>([]);
  const [filterDataUsers, setfilterDataUsers] = useState<IUser[]>(dataUsers);
  const [perfiles, setPerfiles] = useState<IPerfilDto[]>();
  const [allSelected, setAllSelected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();
  //const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  //const [showPagination, setShowPagination] = useState<boolean>(true);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const closeAlert = () => setShowAlert(false);

  const getAllUsuariosService = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IUser[]>> =
        await getAllUsuarios(_responseAuth.data.token);
      //console.log('RESPUESTA :: ', _response.data.data)
      if (_response.data.data) {
        let data = _response.data.data.filter(
          (item) => item.estado === 0 || item.estado === 1
        );
        data.forEach((item) => {
          item.selected = false;
        });
        setDataUsers(data);
        setfilterDataUsers(data);
      }
    }
  };

  const getAllPerfilesService = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IPerfilDto[]>> =
        await getAllPerfiles(_responseAuth.data.token);
      if (_response.data.data) {
        //console.log('PERFILES :: *------- ', _response.data.data);
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

  const createUserService = async (user: IUser) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> = await createUsuario(
        user,
        _responseAuth.data.token
      );
      return _response.data;
    }
  };

  const handleOnActive = async (id: string, estado: boolean) => {
    let aux = [...dataUsers];
    const index = aux.findIndex((item) => item.id.toString() === id);
    if (index >= 0) {
      let newState = 0;
      estado === true ? (newState = 1) : (newState = 0);
      aux[index].estado = newState;
      console.log("");
      let resp = await updateUserState(aux[index]);
      if (resp) {
        if (resp.success) {
          toast.success(resp.message, CONFIG_TOAST);
          getAllUsuariosService();
        } else {
          console.error("Error servidor");
        }
      }
    }
  };

  const handleSelected = (id: string, estado: boolean) => {
    //se valida id == 0 para saber si se esta seleccionando todos los registros
    if (id == "0") {
      setAllSelected(!allSelected);
      let aux = [...dataUsers];
      aux.forEach((item) => {
        item.selected = estado;
      });
      setDataUsers(aux);
    } else {
      let aux = [...dataUsers];
      const index = aux.findIndex((item) => item.id.toString() === id);
      if (index >= 0) {
        aux[index].selected = estado;
        setDataUsers(aux);
      }
    }
  };

  const handleDelete = async () => {
    setShowAlert(true);
  };

  const onResponseAlert = async (option: number) => {
    console.log("Respuesta de la alerta: ", option);
    if (option === 1) {
      setAllSelected(false);
      let aux = [...dataUsers];
      let usersToDelete = aux.filter((item) => item.selected === true);
      if (usersToDelete.length > 0) {
        const res = await handleGetAllTerminalByUsuarios();

        usersToDelete.map((item) => (item.estado = 2));
        let flag = false;
        for await (const user of usersToDelete) {
          let allowDelete = res?.data?.findIndex(
            (item) => item.usuarioId === user.id
          );
          if (allowDelete != undefined && allowDelete < 0) {
            let resp = await updateUserState(user);
            if (resp?.success) {
              flag = true;
            }
          } else {
            toast.info(
              `No se puede eliminar el usuario ${user.codigo} tiene una terminal Asignada`,
              CONFIG_TOAST
            );
          }
        }
        if (flag) {
          toast.success("Registro eliminado", CONFIG_TOAST);
          setShowAlert(false);
          getAllUsuariosService();
        }
      }
    }
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

  const updateUserState = async (data: IUser) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> = await updateUsuario(
        data,
        _responseAuth.data?.token
      );
      return _response.data;
    }
  };

  const handleSave = async (values: any) => {
    let estado = 0;
    console.log("values.Activo: ", values.Activo);
    values.Activo ? (estado = 1) : (estado = 0);
    console.log("ESTADO:: ", estado);
    if (!isEdit) {
      let newUser = {
        id: 0,
        codigo: values.CodigoInterno,
        numeroDocumento: values.numeroDocumento.toString(),
        login: values.Usu,
        password: values.Pa,
        nombreApellido: values.Nombre,
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
          setShow(false);
          getAllUsuariosService();
        } else {
          toast.error(resp.message, CONFIG_TOAST);
        }
      }
    } else {
      const user = dataUsers.find((item) => item.id == values.Id);
      if (typeof user != "undefined") {
        console.log("EDITAR ENTRO");
        let editUser = {
          id: values.Id,
          codigo: values.CodigoInterno,
          numeroDocumento: values.numeroDocumento,
          login: values.Usu,
          password: values.Pa,
          nombreApellido: values.Nombre,
          estadoClave: user?.estadoClave,
          intentos: user?.intentos,
          tipoDocumentoId: 1,
          perfilId: parseInt(values.Perfil),
          empresaId: 1,
          estado: estado,
          fechaCreacion: user?.fechaCreacion,
          fechaModificacion: user?.fechaModificacion,
        };

        let resp = await updateUserState(editUser);

        if (resp) {
          if (resp.success) {
            toast.success(resp.message, CONFIG_TOAST);
            setShow(false);
            getAllUsuariosService();
          } else {
            toast.error(resp.message, CONFIG_TOAST);
          }
        }
      }
    }
  };

  const handleNewUser = () => {
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
    handleShow();
  };

  const handleEdit = async (id: number) => {
    setIsEdit(true);
    const user = await dataUsers.find((item) => item.id === id);
    let estado = false;
    user?.estado == 1 ? (estado = true) : (estado = false);
    if (user) {
      setUser({
        Id: user.id,
        Usu: user.login,
        CodigoInterno: user.codigo,
        Nombre: user.nombreApellido,
        Pa: "",
        Perfil: user.perfilId,
        Activo: estado,
        numeroDocumento: user.numeroDocumento,
      });
    }
    handleShow();
  };

  const handleSearchChange = (value: string) => {
    value = value.toLowerCase();
    if (value == "") {
      setfilterDataUsers(dataUsers);
      //setShowPagination(true);
    } else {
      //setShowPagination(false);
      let aux = dataUsers.filter(
        (item) =>
          item.login.toLowerCase().includes(value) ||
          item.nombreApellido.toLowerCase().includes(value) ||
          item.codigo.toString().includes(value)
      );
      setfilterDataUsers(aux);
    }
  };

  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración Usuario");
      if (resp.status) {
        getAllUsuariosService();
        getAllPerfilesService();
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  useEffect(() => {
    //console.log("Camio filter: ", filterDataUsers);
  }, [filterDataUsers]);

  // const pageSelected = (page: string) => {
  //   //console.log("Numero de pagina: ", page);
  //   let initialValue = parseInt(page) * itemsPerPage - itemsPerPage;
  //   let endValue = itemsPerPage * parseInt(page);
  //   if (dataUsers) {
  //     let aux = dataUsers.slice(initialValue, endValue);
  //     //console.log("AUX PAGINATION: ", aux);
  //     setfilterDataUsers(aux);
  //   }
  // };

  /**
   * Fin: refactorización de código
   */

  return (
    <>
      <br />
      <div className="mt-5">
        {perfiles && (
          <UserTable
            className="card-xxl-stretch mb-12 mb-xl-12"
            dataTable={filterDataUsers}
            perfiles={perfiles}
            onActivate={handleOnActive}
            onEdit={handleEdit}
            onNewUser={handleNewUser}
            onSelected={handleSelected}
            allSelected={allSelected}
            handleSearchChange={handleSearchChange}
          />
        )}
        {/* {filterDataUsers.length > 0 && showPagination && (
          <Pagination
            itemsPerPage={itemsPerPage}
            data={filterDataUsers.length}
            pageSelected={pageSelected}
          />
        )} */}
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
              <Button variant="primary" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {show && (
        <UserModalAdd
          show={show}
          handleClose={handleClose}
          data={user}
          handleSave={handleSave}
          perfiles={perfiles}
          isEdit={isEdit}
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

export default UserAdminPage;
