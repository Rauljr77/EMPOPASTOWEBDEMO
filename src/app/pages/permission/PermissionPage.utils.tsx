import { ESTADO } from "../../constants/Estado";
import { IModuloDto, IPerfilDto, IPermisoDto, IPermisoFullDto, IRequestAuthToken, IRequestBase, IUsuarioDto } from '../../types/General';
import { AxiosResponse } from 'axios';
import { getToken } from "../../services/authToken.service";
import { getAllPermisosFull, updatePermiso } from "../../services/permisos.service";
import { GridColDef } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { KTSVG } from "../../../_metronic/helpers";
import { getAllPerfiles } from "../../services/perfiles.service";
import { getAllModulos } from "../../services/modulos.service";
import { getAllUsuarios } from "../../services/usuarios.service";
import { MODULE_TYPE } from "../../constants/Modules";

export interface IRow {
    isSelect            : boolean;
    id                  : number;
    nombrePerfil        : string;
    descripcionModulo   : string;
    nombreModulo        : string;
    perfilId            : number;
    moduloId            : number;
    estado              : number;
    estadoBoolean       : boolean;
    consultar           : number;
    crear               : number;
    editar              : number;
    eliminar            : number;
}

const FILTER_PARAMETERS: string[] = ["nombrePerfil", "descripcionModulo"];

const searchParameter = (item: any, query: string): boolean => {
    let isFound: boolean = false;
    FILTER_PARAMETERS.forEach((x: string) => { if (item[x].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0) isFound = true; });
    return isFound;
};

export const search = (query: string, rows: IRow[], setCurrentList: (rows: IRow[]) => void) => {
    if (query === "") setCurrentList(rows);
    else {
        let _result = rows.filter(x => searchParameter(x, query));
        setCurrentList(_result);
    }
};

export const initItemSelect = (): IRow => {
    return {
        isSelect            : false,
        id                  : 0,
        nombrePerfil        : "",
        descripcionModulo   : "",
        nombreModulo        : "",
        perfilId            : 0,
        moduloId            : 0,
        estado              : 0,
        estadoBoolean       : false,
        consultar           : 0,
        crear               : 0,
        editar              : 0,
        eliminar            : 0
    };
}
/*
const crud = (state: number, valueReturn: string): string => {
    return state === ESTADO.ACTIVO ? valueReturn : '';
}*/

/**
 * Se podría hacer que desde rows se refresque
 * @param rows 
 * @param setPerfiles 
 */
export const getPerfiles = async(rows: IRow[], setPerfiles: (perfiles: IPerfilDto[]) => void) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data.isAuthSuccessful) {
        const _response: AxiosResponse<IRequestBase<IPerfilDto[]>> = await getAllPerfiles(_responseAuth.data.token);
        if (_response.data.data && _response.data.data.length > 0) {
            
            let perfiles: IPerfilDto[] = [];
            /**
             * Se eliminan los perfiles asociados de la lista
             */
            _response.data.data.forEach(element => {
                const findIndex: number = rows.findIndex(x => x.perfilId === element.id);
                if (findIndex < 0) perfiles.push(element); 
            });
            /**
             * Fin se eliminan los perfiles asociados de las lista.
             */

            let orderList: IPerfilDto[] = perfiles.sort((a: any, b: any) => (a.nombre > b.nombre) ? 1 : (b.nombre > a.nombre) ? -1 : 0);
            setPerfiles(orderList);
        }
    }
}

export const getModulos = async(setModulos: (modulos: IModuloDto[]) => void) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data.isAuthSuccessful) {
        const _response: AxiosResponse<IRequestBase<IModuloDto[]>> = await getAllModulos(_responseAuth.data.token);
        if (_response.data.data) {
            setModulos(_response.data.data);
        }
    }
}

//Agregar validacion
export const getAll = async(setRows:(rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {  
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    const _response: AxiosResponse<IRequestBase<IPermisoFullDto[]>> = await getAllPermisosFull(_responseAuth.data.token);
    if (_response.data.data) {
        //Descartamos las eliminadas o estado == 2
        const _listFiltered: IPermisoFullDto[] = _response.data.data.filter((x: IPermisoFullDto) => x.estado !== ESTADO.ELIMINADO);
        
        //Se debe setear los módulos uno por uno en cada permiso.
        //Se debe realizar con constantes.


        let uniques: IPermisoFullDto[] = [];
        for (let i = 0; i < _listFiltered.length; i++) {
            const item: IPermisoFullDto = _listFiltered[i];
            let isDuplicated: boolean = false;
            for (let k = 0; k < uniques.length; k++) {
                if (uniques[k].perfilId === item.perfilId) {
                    isDuplicated = true;
                    break;
                }
            }
            if (!isDuplicated) uniques.push(item);
        }

        let _result: IRow[] = uniques.map(
            (item: IPermisoFullDto) => 
            ({
                'isSelect'          : false,
                'id'                : item.id,
                'perfilId'          : item.perfilId,
                'moduloId'          : item.moduloId,
                'estado'            : item.estado,
                'estadoBoolean'     : item.estado === ESTADO.ACTIVO ? true : false, 
                'consultar'         : item.consultar,
                'crear'             : item.crear,
                'editar'            : item.editar,
                'eliminar'          : item.eliminar,
                'perfiles'          : item.perfiles,
                'modulos'           : item.modulos,
                'nombrePerfil'      : item.perfiles.nombre,
                'nombreModulo'      : item.modulos.nombre,
                'descripcionModulo' : item.modulos.descripcion,
                'fechaCreacion'     : item?.fechaCreacion,
                'fechaModificacion' : item?.fechaModificacion
            })
        );

        _result.forEach(x => {
            let foundWeb: number = _listFiltered.findIndex(k => k.perfilId === x.perfilId && k.modulos.descripcion === MODULE_TYPE.WEB.name);
            let foundMovil: number = _listFiltered.findIndex(k => k.perfilId === x.perfilId && k.modulos.descripcion === MODULE_TYPE.MOVIL.name);
            debugger;
            if (foundWeb >= 0 && foundMovil >= 0) {x.descripcionModulo = `${MODULE_TYPE.WEB.name} Y ${MODULE_TYPE.MOVIL.name}`;}
            else if (foundWeb >= 0 && foundMovil < 0) {x.descripcionModulo = `${MODULE_TYPE.WEB.name}`;}
            else {x.descripcionModulo = `${MODULE_TYPE.MOVIL.name}`;}
        });
        setRows(_result);
        setCurrentList(_result);
    }
}



export const onAllSelect = (isAllSelect: boolean, rows: IRow[], currentList: IRow[], setAllSelect: (isAllSelect: boolean) => void, setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void): void => {
    let auxOriginal: IRow[] = [...rows];
    let auxCurrent: IRow[] = [...currentList];
    auxOriginal.forEach(element => {
       element.isSelect = isAllSelect;
    });
    auxCurrent.forEach(element => {
        element.isSelect = isAllSelect;
    });
    setRows(auxOriginal);
    setCurrentList(auxCurrent);
    setAllSelect(!isAllSelect);
}

export const updateItemInLists = async(row: IRow, rows: IRow[], currentList: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {
    let auxOriginal: IRow[] = [...rows];
    let auxCurrent: IRow[] = [...currentList];
    let indexOriginal: number = rows.findIndex(x => x.id === row.id)
    let indexCurrent: number = currentList.findIndex(x => x.id === row.id)
    auxOriginal[indexOriginal] = row;
    auxCurrent[indexCurrent] = row;
    setRows(auxOriginal);
    setCurrentList(auxCurrent);
}

/**
 * Se deben activar varios permisos y mostrar un solo mensaje
 * @param row 
 * @param checked 
 * @param rows 
 * @param currentList 
 * @param setRows 
 * @param setCurrentList 
 */

//Corregir el activar
export const changeActive = async(row: IRow, checked: boolean, rows: IRow[], currentList: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {
    let isSuccess: boolean = true;
    const _responseAuth1: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth1.data.isAuthSuccessful) {
        const _responseAllPermiso: AxiosResponse<IRequestBase<IPermisoFullDto[]>> = await getAllPermisosFull(_responseAuth1.data.token);
        if (_responseAllPermiso.data.data) {
            let permisoList: IPermisoFullDto[] = _responseAllPermiso.data.data?.filter(x => x.perfilId === row.perfilId);
            for (let k = 0; k < permisoList.length; k++) {
                const _responseAuth2: AxiosResponse<IRequestAuthToken> = await getToken();
                if (_responseAuth2.data.isAuthSuccessful) {
                    //row.estadoBoolean = checked;
                    //row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
                    const permiso: IPermisoDto = {
                        consultar: permisoList[k].consultar,
                        crear: permisoList[k].crear,
                        editar: permisoList[k].editar,
                        eliminar: permisoList[k].eliminar,
                        estado: checked ? ESTADO.ACTIVO : ESTADO.INACTIVO,
                        id: permisoList[k].id,
                        moduloId: permisoList[k].moduloId,
                        perfilId: permisoList[k].perfilId
                    };
                    const _response: AxiosResponse<IRequestBase<null>> = await updatePermiso(permiso, _responseAuth2.data.token);
                    if (_response.data.success) {
                        toast.success(`Permiso a perfil ${row.nombrePerfil} módulo ${permisoList[k].modulos.nombre} ha sido ${checked ? 'activado' : 'desactivado'} con éxito`);        
                    } else {
                        isSuccess = false;
                        toast.error(`Permiso a perfil ${row.nombrePerfil} módulo ${permisoList[k].modulos.nombre} no se pudo ${checked ? 'activar' : 'desactivar'}`, CONFIG_TOAST);
                    }
                } else {
                    isSuccess = false;
                    toast.error("Error en la plataforma contáctese con el administrador", CONFIG_TOAST);
                }
            }

        } else {
            isSuccess = false;
            toast.error("Error de conexión", CONFIG_TOAST)
        }
    } else {
        isSuccess = false;
        toast.error("Error de conexión", CONFIG_TOAST)
    }
    /**
     * Si todos los permisos fueron actualizados se actualizará la fila.
     */
    if (isSuccess) {
        row.estadoBoolean = checked;
        row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
        updateItemInLists(row, rows, currentList, setRows, setCurrentList);
    }
    /*
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data.isAuthSuccessful) {
        row.estadoBoolean = checked;
        row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
        const permiso: IPermisoDto = {
            consultar: row.consultar,
            crear: row.crear,
            editar: row.editar,
            eliminar: row.eliminar,
            estado: row.estado,
            id: row.id,
            moduloId: row.moduloId,
            perfilId: row.perfilId
        };
        const _response: AxiosResponse<IRequestBase<null>> = await updatePermiso(permiso, _responseAuth.data.token);
        if (_response.data.success) {
            toast.success(`Permiso a perfil ${row.nombrePerfil} ha sido ${row.estado === ESTADO.ACTIVO ? 'activado' : 'desactivado'} con éxito`);
            updateItemInLists(row, rows, currentList, setRows, setCurrentList);
        } else toast.error(`Permiso a perfil ${row.nombrePerfil} no se pudo ${row.estado === ESTADO.ACTIVO ? 'activar' : 'desactivar'}`, CONFIG_TOAST);
    } else toast.error("Error en la plataforma contáctese con el administrador", CONFIG_TOAST);
    */



}

const deleteItem = async(row: IPermisoFullDto, isMustReset: boolean) => {
    const _item: IPermisoDto = {
        consultar: row.consultar,
        crear: row.crear,
        editar: row.editar,
        eliminar: row.eliminar,
        estado: ESTADO.ELIMINADO,
        id: row.id,
        moduloId: row.moduloId,
        perfilId: row.perfilId
    };
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data.isAuthSuccessful) {
        const _response: AxiosResponse<IRequestBase<null>> = await updatePermiso(_item, _responseAuth.data.token);
        if (_response.data.success) {
            isMustReset = true;
            toast.success(`Permiso perfil ${row.perfiles.nombre} módulo: ${row.modulos.nombre} Eliminado`);
        } 
        else toast.error(`No se pudo eliminar el permiso del perfil ${row.perfiles.nombre} módulo: ${row.modulos.nombre}`);
    } else toast.error("No se pudo conectar con el servidor", CONFIG_TOAST)
}

/**
 * Método que elimina los permisos del perfil, valida que no esté asociado a un usuario.
 * @param rows Filas de la tabla.
 * @param setRows Método para actualizar las filas de la tabla.
 * @param setCurrentList Método para actualizar las filas que se muestran en la tabla. 
 */
export const allDeletes = async(rows: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {
    const _responseAuth1: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth1.data.isAuthSuccessful) {
        const _responseUsers: AxiosResponse<IRequestBase<IUsuarioDto[]>> = await getAllUsuarios(_responseAuth1.data.token);
        const _responseAllPermissions: AxiosResponse<IRequestBase<IPermisoFullDto[]>> = await getAllPermisosFull(_responseAuth1.data.token);
        if (_responseUsers.data.success && _responseAllPermissions.data.success && _responseUsers.data.data && _responseAllPermissions.data.data) {
            /**
             * Bloque eliminación cuando no hay usuarios y permisos asociados a los perfiles
             */
            if (_responseUsers.data.data.length <= 0) {  //  Eliminamos todos los seleccionados.
                let isMustReset: boolean = false;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].isSelect) {
                        const permisoList: IPermisoFullDto[] = _responseAllPermissions.data.data.filter(x => x.perfilId === rows[i].perfilId);
                        for (let k = 0; k < permisoList.length; k++) {
                            await deleteItem(permisoList[k], isMustReset);
                        }
                    }
                }
                if (isMustReset)  getAll(setRows, setCurrentList);
            } 
            /**
             * Fin Bloque eliminación cuando no hay usuarios y permisos asociados a los perfiles
             */

            /**
             * Bloque eliminación cuando hay usuarios o permisos para buscar asociaciones
             */
            else {
                let isMustReset: boolean = false;
                for(let i = 0; i < rows.length; i++) {
                    if (rows[i].isSelect) {
                        let indexUsersFound         : number = -1;
                        if (_responseUsers.data.data.length > 0) indexUsersFound = _responseUsers.data.data.findIndex(x => x.perfilId === rows[i].id);
                        
                        if (indexUsersFound < 0) {   // Elimina
                            const permisoList: IPermisoFullDto[] = _responseAllPermissions.data.data.filter(x => x.perfilId === rows[i].perfilId);
                            for (let k = 0; k < permisoList.length; k++) {
                                await deleteItem(permisoList[k], isMustReset);
                            }
                        } else {
                            toast.info(`Los permisos perfil ${rows[i].nombrePerfil} están asociados, no se pueden eliminar`);
                        }
                    }
                }
                if (isMustReset) getAll(setRows, setCurrentList);
            }
            /**
             * Fin Bloque eliminación cuando hay usuarios o permisos para buscar asociaciones
             */
        } else {    
            /* 
             * Cuando los servicio de obtener los usuarios y permisos falla no se podrá buscar asociaciones.
             * Por ello se realiza esta validación.
             */
            toast.error("No se pudo conectar con el servidor", CONFIG_TOAST);
        }   
    } else {    //  Cuando no puede generar el token.
        toast.error("No se pudo conectar con el servidor", CONFIG_TOAST);
    }
}

export const getColumns = (
    onChangeSelect: (row: IRow, checked: boolean) => void, 
    onChangeActive: (row: IRow, checked: boolean) => void,
    onActionEdit: (row: IRow) => void
    ): GridColDef[] => {

    const columns: GridColDef[] = [
        { 
            field: 'isSelect', 
            type: 'actions',
            headerName: '', 
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
                )
            }
        },
        { field: 'nombrePerfil', headerName: 'Perfil', flex: 1 },
        { field: 'descripcionModulo', headerName: 'Menú', flex: 1 },
        { 
            field: 'estadoBoolean', 
            headerName: 'Activo',
            width: 130, 
            type: 'actions', 
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
                )
            }
        },
        { 
            field: 'actions',
            headerName: 'Acciones',
            type: 'actions', 
            renderCell: (params) => {
                return (
                    <button
                        className='btn btn-bg-light btn-active-color-primary btn-sm me-1'
                        onClick={() => onActionEdit(params.row)}
                    >
                        <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                        Editar
                    </button>
                )
            } 
        },
    ];
    return columns;
}