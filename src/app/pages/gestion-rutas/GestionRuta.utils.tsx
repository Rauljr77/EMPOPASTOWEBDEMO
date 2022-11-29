
import { GridColDef } from '@mui/x-data-grid';
import { IGestionRutas, IRequestAuthToken, IRequestBase, IRuta } from '../../types/General';
import { AxiosResponse } from 'axios';
import { getToken } from '../../services/authToken.service';
import { getGestionRutas } from '../../services/rutas.service';
import { toast } from 'react-toastify';
import { CONFIG_TOAST } from '../../constants/ConfigToast';
import { ESTADO } from '../../constants/Estado';
import { updateActivarRuta } from '../../services/ruta.service';

/**
 * No extiende por el momento, pero podría ser necesario.
 */
export interface IRow extends IGestionRutas {
    activo: boolean;
}

const FILTER_PARAMETERS: string[] = ["nombreRuta", "cantidadPredios", "codigoPeriodo",  "codigoTerminal", "lector"];

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
        id: 0,
        nombreRuta: "",
        nombreZona: "",
        cantidadPredios: 0,
        codigoPeriodo: 0,
        codigoTerminal: "",
        nombreUsuario: "",
        lector: 0,
        estado: 0,
        activo: false
    };
}

export const getAll = async(setRows:(rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {  
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    const _response: AxiosResponse<IRequestBase<IGestionRutas[]>> = await getGestionRutas(_responseAuth.data.token);
    if (_response.data.data) {
        const _result: IRow[] = _response.data.data.map(
            (item: IGestionRutas, index: number) => 
            ({
                'id'                : item.id,
                'nombreRuta'        : item.nombreRuta,
                'nombreZona'        : item.nombreZona,
                'cantidadPredios'   : item.cantidadPredios,
                'codigoPeriodo'     : item.codigoPeriodo,
                'codigoTerminal'    : item.codigoTerminal,
                'nombreUsuario'     : item.nombreUsuario,
                'lector'            : item.lector,
                'estado'            : item.estado,
                'activo'            : item.estado === ESTADO.ACTIVO ? true : false
            })
        );
        setRows(_result);
        setCurrentList(_result);
    }
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

export const sendRoutes = async(rows: IRow[]) => {
    if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {

            if (rows[i].activo && rows[i].estado === ESTADO.INACTIVO) {

                const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
                if (_responseAuth.data.isAuthSuccessful) {
                    const ruta: IRuta = {
                        id: rows[i].id,
                        nombre: rows[i].nombreRuta,
                        estado: ESTADO.ACTIVO,
                        fechaCreacion: null,
                        fechaModificacion: null
                    }
                    const _response: AxiosResponse<IRequestBase<null>> = await updateActivarRuta(ruta, _responseAuth.data.token);
                    if (_response.data.success) {
                        toast.success(`Ruta ${rows[i].nombreRuta} activada`, CONFIG_TOAST);
                    } else {
                        //En caso de no activarse la ruta deberá hacer que el check se ponga en falso.
                        toast.error(`Error, ruta ${rows[i].nombreRuta} no se pudo activar`, CONFIG_TOAST);
                    }
                } else {
                    toast.error(`${_responseAuth.data.errorMessage}`, CONFIG_TOAST);
                }
            }
        }
    }
}

export const getColumns = (
    onChangeActive: (row: IRow, checked: boolean) => void
    ): GridColDef[] => {

    const columns: GridColDef[] = [
        { field: 'nombreRuta', headerName: 'Ruta', flex: 1 },
        { field: 'cantidadPredios', headerName: 'Cantidad de predios', flex: 1 },
        { field: 'codigoPeriodo', headerName: 'Periodo', flex: 1 },
        { field: 'codigoTerminal', headerName: 'Terminal', flex: 1 },
        { field: 'lector', headerName: 'Lector', flex: 1 },
        { 
            field: 'activo', 
            type: 'actions',
            headerName: 'Activo',
            width: 130,
            renderCell: (params) => {
                return (
                    <input 
                        className="form-check-input widget-9-check"
                        name="active" 
                        type="checkbox"
                        checked={params.row.activo} 
                        onChange={(e) => onChangeActive(params.row, e.target.checked)}
                    />
                )
            }
        }
    ];
    return columns;
}