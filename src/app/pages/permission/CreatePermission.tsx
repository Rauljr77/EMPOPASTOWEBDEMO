import { useEffect, useState } from 'react'
import { AxiosResponse } from 'axios';
import { getToken } from '../../services/authToken.service';
import { IModuloDto, IPerfilDto, IPermisoDto, IRequestAuthToken, IRequestBase } from '../../types/General';
import { ESTADO } from '../../constants/Estado';
import { Modal } from 'react-bootstrap';
import { MODULE_TYPE } from '../../constants/Modules';
import { createPermiso } from '../../services/permisos.service';
import { toast } from 'react-toastify';
import { CONFIG_TOAST } from '../../constants/ConfigToast';
import './stylePermission.scss';

interface IRow {
  isSelect          : boolean;
  id                : number;
  perfilId          : number;
  moduloId          : number; 
  nombreModulo      : string;
  descripcionModulo : string;
  estado            : boolean; //  Estado del permiso que se mapeará a número al guardar.
  isConsultar       : boolean;
  isCrear           : boolean;
  isEditar          : boolean;
  isEliminar        : boolean;
  all               : boolean;
}

interface CreatePermissionProps {
  dataProfiles: IPerfilDto[];
  dataModules: IModuloDto[];
  isVisible: boolean;
  onAccept(isSuccess: boolean): void;
  onCancel(): void;
}

const CreatePermission = (props: CreatePermissionProps) => {

  const [rows, setRows] = useState<IRow[]>([]);
  const [menuSelect, setMenuSelect] = useState<string>(MODULE_TYPE.WEB.name);
  const [idProfileSelect, setIdProfileSelect] = useState<number>(props.dataProfiles[0].id);
  const [isActive, setActive] = useState<boolean>(false);
  const [isActivation, setActivation] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);

  const initDataTable = (perfilId: number, descripcionModule: string) => {  
    const modulesFilter: IModuloDto[] =  props.dataModules ? props.dataModules?.filter((x) => x.descripcion === descripcionModule): [];
    let listTemp: IRow[] = [];
    const auxModuleFilter = [...modulesFilter];

    auxModuleFilter?.forEach(element => {
      listTemp.push({
        isSelect          : false,
        id                : element.id,
        moduloId          : element.id,
        nombreModulo      : element.nombre,
        descripcionModulo : element.descripcion, 
        perfilId          : perfilId,
        estado            : false,
        isConsultar       : false,
        isCrear           : false,
        isEditar          : false,
        isEliminar        : false,
        all               : false
      });
    });
    setRows(listTemp);
  }

  const validateCRUD = (item: IRow, value: boolean): boolean => {
    return item.all ? false : (item.isConsultar && item.isCrear && item.isEditar && item.isEliminar) ? false : value;
  }

  const onChangeSelect = (value: boolean, index: number) => {
    let aux: IRow[] = [...rows];
    aux[index].isSelect = value;
    if (!value) {
      aux[index].isConsultar = false;
      aux[index].isCrear     = false;
      aux[index].isEditar    = false;
      aux[index].isEliminar  = false;
      aux[index].all         = false;
    }
    setRows(aux);
  }

  const onChangeConsultar = (item: IRow, index: number) => {
    let aux: IRow[] = [...rows];
    aux[index].isConsultar = aux[index].all ? false : validateCRUD(item, item.isConsultar);
    setRows(aux);
  }

  const onChangeCrear = (item: IRow, index: number) => {
    let aux: IRow[] = [...rows];
    aux[index].isCrear = aux[index].all ? false : validateCRUD(item, item.isCrear);
    setRows(aux);
  }

  const onChangeEditar = (item: IRow, index: number) => {
    let aux: IRow[] = [...rows];
    aux[index].isEditar = aux[index].all ? false : validateCRUD(item, item.isEditar);
    setRows(aux);
  }

  const onChangeEliminar = (item: IRow, index: number) => {
    let aux: IRow[] = [...rows];
    aux[index].isEliminar = aux[index].all ? false : validateCRUD(item, item.isEliminar);
    setRows(aux);
  }

  const onChangeAll = (value: boolean, index: number) => {
    let aux: IRow[] = [...rows];
    aux[index].all = value;
    aux[index].isConsultar = false;
    aux[index].isCrear = false;
    aux[index].isEditar = false;
    aux[index].isEliminar = false;
    setRows(aux);
  }

  //Hacer que el botón se ejecute una sola vez
  const handleAssociatePermission = async () => {
    if (rows) {
      for (let i = 0; i < rows?.length; i++) {
        if (rows[i].isSelect) {
          const _item: IPermisoDto = {
            id: 0,
            perfilId: rows[i].perfilId,
            moduloId: rows[i].moduloId,
            estado: isActive ? ESTADO.ACTIVO : ESTADO.INACTIVO,
            consultar: rows[i].all ? ESTADO.ACTIVO : rows[i].isConsultar ? ESTADO.ACTIVO : ESTADO.INACTIVO,
            crear: rows[i].all ? ESTADO.ACTIVO : rows[i].isCrear ? ESTADO.ACTIVO : ESTADO.INACTIVO,
            editar: rows[i].all ? ESTADO.ACTIVO : rows[i].isEditar ? ESTADO.ACTIVO : ESTADO.INACTIVO,
            eliminar: rows[i].all ? ESTADO.ACTIVO : rows[i].isEliminar ? ESTADO.ACTIVO : ESTADO.INACTIVO
          };
          const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
          if (_responseAuth.data.isAuthSuccessful) {
            const _response: AxiosResponse<IRequestBase<null>> = await createPermiso(_item, _responseAuth?.data.token);
            if (_response.data.success) {
              setActivation(false);
              toast.success(`Se asoció el permiso de manera correcta`, CONFIG_TOAST);
              setReset(true);
              props.onAccept(true);
            } else {
              setActivation(false);
              toast.error(`Permiso en módulo ${rows[i].nombreModulo} ${_response.data.message}`, CONFIG_TOAST); 
              props.onAccept(true); 
            }
          } else {
            setActivation(false);
          }
        }
      }
    } else {
      setActivation(false);
    }
  }

  useEffect(() => {
    if (reset) {
      initDataTable(idProfileSelect, menuSelect);
      setReset(false);
    }
  },[reset])

  useEffect(() => {
    initDataTable(idProfileSelect, menuSelect);
  },[idProfileSelect, menuSelect])

  return (
    <>
      <Modal 
        className="my-modal"
        show={props.isVisible} 
        onHide={props.onCancel}
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Asociar permisos</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <form className='form'>
          <div className='form-group mb-3'>
            <label>Perfil*</label>
            <select className='form-select' aria-label="Default select" placeholder='Selecciona un perfil' onChange={(event) => {
              setIdProfileSelect(Number(event.target.value));
            }}>
              {props.dataProfiles?.map((item: IPerfilDto) => (
                <option 
                  key={item.id} 
                  value={item.id}                      
                >
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group mb-3'>
            <label>Menú*</label>
              <select className='form-select' aria-label="Default select" placeholder='Seleccione' onChange={(event) => {
                setMenuSelect(event.target.value);
              }}>
                  <option key="id_web" value={MODULE_TYPE.WEB.name}>
                    {MODULE_TYPE.WEB.name}
                  </option>
                  <option key="id_movil" value={MODULE_TYPE.MOVIL.name}>
                    {MODULE_TYPE.MOVIL.name}
                  </option>
              </select>
          </div>
              
          <div className='row'>
            <table className='table-associate'>
              <thead>
                  <tr className='main-headers'>
                    <th>Acceso a módulos*</th>
                    <th colSpan={5}>Gestión de usuarios</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th>Consultar</th>
                    <th>Crear</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                    <th>Todos</th>
                  </tr>
                </thead>
                <tbody>
                  {rows ? rows.map((row, rowIndex) => {
                    return (
                      <tr key={rowIndex}>

                        <td key={`r_${rowIndex}_c_2`}>
                            <input 
                              type="checkbox" 
                              name={`isSelect_${rowIndex}`} 
                              id={`isSelect_${rowIndex}`}
                              key={`isSelect_${rowIndex}`} 
                              checked={row.isSelect}
                              onChange={(e) => {
                                onChangeSelect(e.target.checked, rowIndex);
                              }}
                            /> {row.nombreModulo}
                        </td>

                        <td key={`r_${rowIndex}_c_3`}>
                            <input 
                              type="checkbox" 
                              name={`isConsultar_${rowIndex}`}  
                              id={`isConsultar_${rowIndex}`}
                              key={`isConsultar_${rowIndex}`} 
                              disabled={row.all || !row.isSelect ? true :  false}
                              checked={row.isConsultar}
                              onChange={(e) => {
                                let _row: IRow = row;
                                _row.isConsultar = e.target.checked;
                                onChangeConsultar(_row, rowIndex);
                              }}
                            />
                        </td> 
                        
                        <td key={`r_${rowIndex}_c_4`}>
                            <input 
                              type="checkbox" 
                              name={`isCrear_${rowIndex}`} 
                              id={`isCrear_${rowIndex}`}
                              key={`isCrear_${rowIndex}`} 
                              disabled={row.all || !row.isSelect ? true :  false}
                              checked={row.isCrear}
                              onChange={(e) => {
                                let _row: IRow = row;
                                _row.isCrear = e.target.checked;
                                onChangeCrear(row, rowIndex);  
                              }}
                            />
                        </td>
                        
                        <td key={`r_${rowIndex}_c_5`}>
                            <input 
                              type="checkbox" 
                              name={`isEditar_${rowIndex}`} 
                              id={`isEditar_${rowIndex}`}
                              key={`isEditar_${rowIndex}`} 
                              disabled={row.all || !row.isSelect ? true :  false}
                              checked={row.isEditar}
                              onChange={(e) => {
                                let _row: IRow = row;
                                _row.isEditar = e.target.checked;
                                onChangeEditar(row, rowIndex); 
                              }}
                            />
                        </td>
                        
                        <td key={`r_${rowIndex}_c_6`}>
                            <input 
                              type="checkbox" 
                              name={`isEliminar_${rowIndex}`} 
                              id={`isEliminar_${rowIndex}`}
                              key={`isEliminar_${rowIndex}`} 
                              disabled={row.all || !row.isSelect ? true :  false}
                              checked={row.isEliminar}
                              onChange={(e) => {
                                let _row: IRow = row;
                                _row.isEliminar = e.target.checked;
                                onChangeEliminar(row, rowIndex);  
                              }}
                            />
                        </td>
                        
                        <td key={`r_${rowIndex}_c_7`}>
                          <input 
                            type="checkbox" 
                            name={`isAll_${rowIndex}`} 
                            id={`isAll_${rowIndex}`}
                            key={`isAll_${rowIndex}`} 
                            disabled={!row.isSelect ? true : false}
                            checked={row.all}
                            onChange={(e) => 
                              {
                                row.isConsultar = false;
                                row.isCrear = false;
                                row.isEditar = false;
                                row.isEliminar = false;
                                onChangeAll(e.target.checked, rowIndex) 
                              }
                            }
                          />
                        </td>

                      </tr>
                    )
                  })

                    : 
                    <></>}
                </tbody>
              </table>
            </div>

            <div className='row mt-3 mb-3 p-0'>
              <label className='col-3 col-form-label'>Activo: </label>
              <div className='col-9 align-self-center'>
                  <input
                      className="form-check-input"
                      type='checkbox'
                      defaultChecked={isActive}
                      onChange={(e) => setActive(e.target.checked)}
                  />
              </div>
            </div>

            <div className='row m-0'>
              <div className='col-6'>
                <div className='row m-0'>
                  <button 
                    disabled={isActivation}
                    type='button' 
                    onClick={() => {
                      setActivation(true);
                      handleAssociatePermission();
                    }} 
                    className="btn btn-primary">
                      Asociar permiso
                  </button>
                </div>
              </div>
              <div className='col-6'>
                <div className='row m-0'>
                  <button type='button' onClick={() => {
                    props.onCancel();
                    setReset(true);
                  }} className="btn btn-secondary">Cancelar</button>
                </div>
              </div>
            </div>

          </form>
        </Modal.Body>
      
      </Modal>  
    </>
  )
}

export default CreatePermission;
