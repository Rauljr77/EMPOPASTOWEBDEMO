import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { CONFIG_TOAST } from '../../constants/ConfigToast';
import { AxiosResponse } from 'axios';
import { IRequestAuthToken, IRequestBase, IConsultaRuta, IWriteRuta } from '../../types/General';
import { getToken } from '../../services/authToken.service';
import { getConsultarRutas, writeRutasFromFile } from '../../services/lectura.service';
import moment from 'moment';

export interface IRow extends IConsultaRuta {
    isSelect: boolean;  // Sí esta seleccionada la fila
}

const FILTER_PARAMETERS: string[] = ["ruta"];

const searchParameter = (item: any, query: string): boolean => {
    let isFound: boolean = false;
    FILTER_PARAMETERS.forEach((x: string) => { if (item[x].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0) isFound = true; });
    return isFound;
};

/**
 * Search by four parameters or filters.
 * @param query Search input.
 * @param dateBegin Begin date input.
 * @param dateEnd End date input.
 * @param rows List type IRow[]
 * @param setCurrentList Method for set current list.
 */
export const search = (query: string, dateBegin: string, dateEnd: string, rows: IRow[], setCurrentList: (rows: IRow[]) => void) => {
    let _result: IRow[] = rows;
    if (query.length > 0) {
        let _filter: IRow[] = _result.filter(x => searchParameter(x, query));
        _result = _filter;
    }
    if (dateBegin.length > 0) {
        let _filter: IRow[] = _result.filter(x => getDate(x.fecha) >= dateBegin);
        _result = _filter;
    }
    if (dateEnd.length > 0) {
        let _filter: IRow[] = _result.filter(x => getDate(x.fecha) <= dateEnd);
        _result = _filter;
    }
    setCurrentList(_result);
};

/**
 * 
 * @param date Date that will be split, parameter with format dd-MM-yyyyThh:mm:ss
 * @returns string date format dd-MM-yyyy
 */
const getDate = (date: string): string => {
    let blocks: string[] = date.split("T");
    return blocks[0];
}

/**
 * Initialize list.
 * @param setRows Method for to set original list.
 * @param setCurrentList Method for to set current list.
 */
export const getAll = async (setRows:(rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {  
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    const _response: AxiosResponse<IRequestBase<IConsultaRuta[]>> = await getConsultarRutas(_responseAuth.data.token);
    if (_response.data.data) {
        const _result: IRow[] = _response.data.data.map(
            (item: IConsultaRuta) => 
            ({
                'isSelect': false,
                'id': item.id,
                'ruta': item.ruta,
                'fecha': item.fecha,
                'terminada': item.terminada
            })
        );
        setRows(_result);
        setCurrentList(_result);
    }
}

export const onAllSelect = (rows: IRow[], currentList: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void): void => {
    let auxOriginal: IRow[] = [...rows];
    let auxCurrent: IRow[] = [...currentList];
    auxOriginal.forEach(element => {
       element.isSelect = true;
    });
    auxCurrent.forEach(element => {
        element.isSelect = true;
    });
    setRows(auxOriginal);
    setCurrentList(auxCurrent);
}

export const updateItemInLists = (row: IRow, rows: IRow[], currentList: IRow[], setRows: (rows: IRow[]) => void, setCurrentList: (rows: IRow[]) => void) => {
    let auxOriginal: IRow[] = [...rows];
    let auxCurrent: IRow[] = [...currentList];
    let indexOriginal: number = rows.findIndex(x => x.id === row.id)
    let indexCurrent: number = currentList.findIndex(x => x.id === row.id)
    auxOriginal[indexOriginal] = row;
    auxCurrent[indexCurrent] = row;
    setRows(auxOriginal);
    setCurrentList(auxCurrent);
}

export const AllDownloads = async (rows: IRow[]) => {
    if (rows.length > 0) {
        for (let i = 0; i < rows.length ; i++)
        {
            if (rows[i].isSelect && rows[i].terminada){
                let resp = await handleWriteRutasFromFile({id: rows[i].id, nombreArchivo : rows[i].ruta, estado : 1});
                if ( resp.success ){
                    toast.success(`Se ha generado el archivo ZIP para la ruta ${rows[i].ruta} en el servidor`, CONFIG_TOAST);   
                }else {
                    toast.error(`Error al descargar ${rows[i].ruta}`, CONFIG_TOAST);
                }
            }               
        }
    }
}

const handleWriteRutasFromFile = async (data: IWriteRuta) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    const _response: AxiosResponse<IRequestBase<null>> = await writeRutasFromFile(data, _responseAuth.data.token);
    return _response.data
}

export const getColumns = (
    onChangeSelect: (row: IRow, checked: boolean) => void
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
        { 
            field: 'ruta', 
            headerName: 'Ruta', 
            flex: 1,
        },
        { 
            field: 'fecha',
            headerName: 'Fecha',
            valueFormatter: params =>  moment(params?.value).format("DD/MM/YYYY hh:mm A"),
            flex: 1,
                
        },
        { 
            field: 'terminada', 
            headerName: 'Terminada', 
            width: 130, 
            type: 'boolean',
            editable: false
        },
    ];
    return columns;
}