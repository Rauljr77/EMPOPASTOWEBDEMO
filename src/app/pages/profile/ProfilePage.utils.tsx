import { ESTADO } from "../../constants/Estado";
import { IPerfilDto, IPermisoDto, IRequestAuthToken, IRequestBase, IUsuarioDto } from "../../types/General";
import { AxiosResponse } from 'axios';
import { getToken } from "../../services/authToken.service";
import { getAllPerfiles, updatePerfil } from "../../services/perfiles.service";
import { GridColDef } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { KTSVG } from "../../../_metronic/helpers";
import { getAllUsuarios } from "../../services/usuarios.service";
import { getAllPermisos } from "../../services/permisos.service";
//import { ITableColumn } from "../../components/table/TableComponent";

/**
 * Extiende de la interface IPerfilDto. contiene el campo isSelect para saber si está la fila seleccionada.
 */
 export interface IRow extends IPerfilDto {
    isSelect        : boolean;  // Sí esta seleccionada la fila
    estadoBoolean   : boolean;
}

const FILTER_PARAMETERS: string[] = ["codigo", "nombre", "descripcion"];

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
        isSelect: false,
        id: 0,
        codigo: "0",
        descripcion: "",
        estado: 0,
        estadoBoolean: false,
        fechaCreacion: "",
        fechaModificacion: "",
        nombre: ""
    };
}

export const getAll = async(setRows:(rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {  
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    const _response: AxiosResponse<IRequestBase<IPerfilDto[]>> = await getAllPerfiles(_responseAuth.data.token);
    if (_response.data.data) {
        //Descartamos las eliminadas o estado == 2
        const _listFiltered: IPerfilDto[] = _response.data.data.filter((x: IPerfilDto) => x.estado !== ESTADO.ELIMINADO);
        const _result: IRow[] = _listFiltered.map(
            (item: IPerfilDto) => 
            ({
                'isSelect': false,
                'id': item.id,
                'codigo': item.codigo,
                'nombre': item.nombre,
                'descripcion': item.descripcion,
                'estado': item.estado,
                'estadoBoolean': item.estado === ESTADO.ACTIVO ? true : false,
                'fechaCreacion': item.fechaCreacion,
                'fechaModificacion': item.fechaModificacion
            })
        );
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

export const changeActive = async(row: IRow, checked: boolean, rows: IRow[], currentList: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data.isAuthSuccessful) {
        row.estadoBoolean = checked;
        row.estado = checked ? ESTADO.ACTIVO : ESTADO.INACTIVO;
        const perfil: IPerfilDto = {
            codigo: row.codigo,
            descripcion: row.descripcion,
            estado: row.estado,
            fechaCreacion: row.fechaCreacion,
            fechaModificacion: row.fechaModificacion,
            id: row.id,
            nombre: row.nombre
        };
        const _response: AxiosResponse<IRequestBase<null>> = await updatePerfil(perfil, _responseAuth.data.token);
        if (_response.data.success) {
            toast.success(`Perfil ${row.nombre} ha sido ${row.estado === ESTADO.ACTIVO ? 'activado' : 'desactivado'} con éxito`);
            updateItemInLists(row, rows, currentList, setRows, setCurrentList);
        } else toast.error(`Perfil ${row.nombre} no se pudo ${row.estado === ESTADO.ACTIVO ? 'activar' : 'desactivar'}`, CONFIG_TOAST);
    } else toast.error("Error en la plataforma contáctese con el administrador", CONFIG_TOAST);
}

const deleteItem = async(row: IRow, isMustReset: boolean) => {
    const _item: IPerfilDto = {
        id: row.id,
        codigo: row.codigo,
        nombre: row.nombre,
        descripcion: row.descripcion,
        estado: ESTADO.ELIMINADO,
        fechaCreacion: row.fechaCreacion,
        fechaModificacion: row.fechaModificacion
    };
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data.isAuthSuccessful) {
        const _response: AxiosResponse<IRequestBase<null>> = await updatePerfil(_item, _responseAuth.data.token);
        if (_response.data.success) {
            isMustReset = true;
            toast.success(`Perfil nombre: ${row.nombre} Eliminado`);
        } 
        else toast.error(`No se pudo eliminar el perfil nombre: ${row.nombre}`)
    } else toast.error("No se pudo conectar con el servidor", CONFIG_TOAST)
}

export const allDeletes = async(rows: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {
    const _responseAuth1: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth1.data.isAuthSuccessful) {
        const _responseUsers: AxiosResponse<IRequestBase<IUsuarioDto[]>> = await getAllUsuarios(_responseAuth1.data.token);
        const _responsePermissions: AxiosResponse<IRequestBase<IPermisoDto[]>> = await getAllPermisos(_responseAuth1.data.token);
        if (_responseUsers.data.success && _responsePermissions.data.success && _responseUsers.data.data && _responsePermissions.data.data) {
            /**
             * Bloque eliminación cuando no hay usuarios y permisos asociados a los perfiles
             */
            if (_responseUsers.data.data.length <= 0 && _responsePermissions.data.data.length <= 0) {  //  Eliminamos todos los seleccionados.
                let isMustReset: boolean = false;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].isSelect) {
                        await deleteItem(rows[i], isMustReset);
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
                        let indexPermissionsFound   : number = -1;
                        if (_responseUsers.data.data.length > 0) indexUsersFound = _responseUsers.data.data.findIndex(x => x.perfilId === rows[i].id);
                        if (_responsePermissions.data.data.length > 0) indexPermissionsFound = _responsePermissions.data.data.findIndex(x => x.perfilId === rows[i].id);
                        
                        if (indexUsersFound < 0 && indexPermissionsFound < 0) {   // Elimina
                            await deleteItem(rows[i], isMustReset);
                        } else {
                            toast.info(`Perfil nombre: ${rows[i].nombre} está asociado`);
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
        { field: 'codigo', headerName: 'Código', flex: 1 },
        { field: 'nombre', headerName: 'Perfil', flex: 1 },
        { field: 'descripcion', headerName: 'Descripción', flex: 1 },
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