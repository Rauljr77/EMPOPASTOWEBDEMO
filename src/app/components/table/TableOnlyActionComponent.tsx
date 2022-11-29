/**
 * @author Raúl Júnior Bolaños Vásquez.
 */

 import React, { useState, useEffect } from "react";
 import { KTSVG } from "../../../_metronic/helpers";
 import { ESTADO } from '../../constants/Estado';
 
 /**
  * @property data Array de cualquier tipo.
  * @property tableColumn Array de tipo ITableColumn.
  * @property filterParameters Array de tipo string.
  */
 export interface ITableComponentProps {
     className                   : string;
     data                        : any[] | null | undefined;
     tableColumns                : ITableColumn[];
     tableTitle                  : string;
     filterParameters            : string[];
     textAdd                     : string;
     textAccion                  : string;
     isAllSelects                : boolean;
     onNew()                     : void;        
     onCheckRow(item: any)       : void;
     onEditRow(item: any)        : void;
     onAllSelectRows()           : void;
     onDeleteSelects()           : void; 
 }
 
 /**
  * @property columnName Nombre de la columna.
  * @property columnProperty Nombre del atributo del objeto con el que se relacionará la columna.
  */
 export interface ITableColumn {
     columnName      : string;
     columnProperty  : string;
 };
 
 /**
  * Tabla con filtro y paginador configurables, funciona con cualquier modelo de datos.
  * @param props Objeto de tipo ITableComponentProps.
  * @returns Devuelve una tabla que tiene filtro y paginador.
  */
 export const TableOnlyActionComponent = (props: ITableComponentProps) => {
 
     const [currentModelList, setCurrentModelList] = useState<any[] | null | undefined>(props.data);   //  Para la tabla.
     const [query, setQuery] = useState(""); //  Para el filtro search
 
     const searchParameter = (item: any, query: string): boolean => {
         let isFound: boolean = false;
         props.filterParameters.forEach((x: string) => { if (item[x].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0) isFound = true; });
         return isFound;
     };
 
     const search = () => {
         if (query === "") setCurrentModelList(props.data);
         else {
             let _result = props?.data?.filter(x => searchParameter(x, query));
             setCurrentModelList(_result);
         }
     };
 
     const updateCurrentList = (index: number, checked: boolean) => {
         if (currentModelList) {
             let aux = [...currentModelList];
             aux[index].isSelect = checked;
             setCurrentModelList(aux);
         }
     }
 
     const allSelectRows = async () => {
         if (currentModelList) {
             let aux = [...currentModelList];
             aux.forEach(item => {
             item.isSelect = true;
             });
             setCurrentModelList(aux);
         }
     }
 
     useEffect(() => {
         search();
     });
 
     return (
         <>
             <div className={`card ${props.className}`}>
                 {/* begin::Header */}
                 <div className='card-header border-0 pt-5'>
                     <h3 className='card-title align-items-start flex-column'>
                     <span className='card-label fw-bold fs-3 mb-1'>{props.tableTitle}</span>
                     </h3>
                     <div
                         className='card-toolbar'
                         data-bs-toggle='tooltip'
                         data-bs-placement='top'
                         data-bs-trigger='hover'
                         title='Click to add a user'
                         >
                         <button
                             className='btn btn-sm btn-light-primary'
                             onClick={props.onNew}
                         >
                             <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                             {props.textAdd}
                         </button>
                         </div>
                         
                 </div>
                 {/* end::Header */}
                 <div className="row m-0 p-0 align-self-end px-5">
                     {/* begin::Search */}
                     <div className='d-flex align-items-center position-relative my-1'>
                         <KTSVG
                         path='/media/icons/duotune/general/gen021.svg'
                         className='svg-icon-1 position-absolute ms-6'
                         />
                         <input
                         type='text'
                         data-kt-user-table-filter='search'
                         className='form-control form-control-solid w-250px ps-14'
                         placeholder='Buscar'
                         value={query}
                         onChange={(e)=> setQuery(e.target.value)}
                         />
                     </div>
                     {/* end::Search */}
                 </div>
                 {/* begin::Body */}
                 <div className='card-body py-3'>
 
                     {/* begin::Table container */}
                     <div className='table-responsive'>
                         {/* begin::Table */}    
                         <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                             {/* begin::Table head */}
                             <thead>
                                 <tr key={'row_head'} className='fw-bold text-muted'>
                                     <th key={"th_key"} className='min-w-140px'></th>
                                     {props.tableColumns ? props.tableColumns.map((column, index) => {
                                         return (
                                             <th key={`th_${index.toString()}`} className='min-w-140px'>{column.columnName}</th>
                                         )
                                     }) : <></>}
                                     <th key={`th_acciones`} className='min-w-140px'>Acciones</th>
                                 </tr>
                             </thead>
                             {/* end::Table head */}
                             {/* begin::Table body */}
                             <tbody>
                             {currentModelList && !props.isAllSelects ? currentModelList.map((row, rowIndex) => {
                                     return (
                                         <tr key={`row_${rowIndex}`}>
                                             {/*Primera celda la cuál es checkbox y la propiedad es boolean*/}
                                             <td key={`td_c_key_r_${rowIndex}`}>
                                                 <input 
                                                     id={`id_check_${rowIndex}`} 
                                                     className="form-check-input widget-9-check"
                                                     name={`name_check_${rowIndex}`} 
                                                     key={`row_check_${rowIndex}`} 
                                                     type="checkbox" 
                                                     defaultChecked={row["isSelect"]} 
 
                                                     onChange={(e) => {
                                                         currentModelList[rowIndex].isSelect = e.target.checked;
                                                         row["isSelect"] = e.target.checked;
                                                         props.onCheckRow(row);
                                                         updateCurrentList(rowIndex, e.target.checked);
                                                     }}
                                                 />
                                             </td>
                                             {/*Fin Primera celda la cuál es checkbox y la propiedad es boolean*/}
                                             {/*Celdas intermedias*/}
                                             {props.tableColumns.map((cell, colIndex) => {
                                                 return (      
                                                     <td key={`td_c_${colIndex}_r_${rowIndex}`}>
                                                         <p className="text-dark fw-bold text-hover-primary d-block fs-6">{row[cell.columnProperty]}</p>
                                                     </td>
                                                 )
                                             })}
                                             {/*Fin Celdas intermedias*/}
                                             {/*Última celda la cuál es button*/}
                                             <td>
                                                 <div className='d-flex justify-content-end flex-shrink-0'>
                                                     <button
                                                         className='btn btn-bg-light btn-active-color-primary btn-sm me-1'
                                                         onClick={() => props.onEditRow(row)}
                                                         >
                                                         <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                                                         {props.textAccion}
                                                     </button>
                                                 </div>
                                             </td>
                                             {/*Fin Última celda la cuál es button*/}
                                         </tr>
                                     )
                                 }) : <></>  
                                 }
                                 {currentModelList && props.isAllSelects? currentModelList.map((row, rowIndex) => {
                                     return (
                                         <tr key={`row_${rowIndex}`}>
                                             {/*Primera celda la cuál es checkbox y la propiedad es boolean*/}
                                             <td key={`td_c_key_r_${rowIndex}`}>
                                                 <input 
                                                     id={`id_check_${rowIndex}`} 
                                                     className="form-check-input widget-9-check"
                                                     name={`name_check_${rowIndex}`} 
                                                     key={`row_check_${rowIndex}`} 
                                                     type="checkbox" 
                                                     defaultChecked={true} 
 
                                                     onChange={(e) => {
                                                         currentModelList[rowIndex].isSelect = e.target.checked;
                                                         row["isSelect"] = e.target.checked;
                                                         props.onCheckRow(row);
                                                     }}
                                                 />
                                             </td>
                                             {/*Fin Primera celda la cuál es checkbox y la propiedad es boolean*/}
                                             {/*Celdas intermedias*/}
                                             {props.tableColumns.map((cell, colIndex) => {
                                                 return (      
                                                     <td key={`td_c_${colIndex}_r_${rowIndex}`}>
                                                         <p className="text-dark fw-bold text-hover-primary d-block fs-6">{row[cell.columnProperty]}</p>
                                                     </td>
                                                 )
                                             })}
                                             {/*Fin Celdas intermedias*/}
                                             {/*Última celda la cuál es button*/}
                                             <td>
                                                 <div className='d-flex justify-content-end flex-shrink-0'>
                                                     <button
                                                         className='btn btn-bg-light btn-active-color-primary btn-sm me-1'
                                                         onClick={() => props.onEditRow(row)}
                                                         >
                                                         <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                                                         {props.textAccion}
                                                     </button>
                                                 </div>
                                             </td>
                                             {/*Fin Última celda la cuál es button*/}
                                         </tr>
                                     )
                                 }) : <></>  
                                 }
                             </tbody>
                         </table>
                     </div>
                     {/* end::Table container */}           
                 </div>
                 {/* begin::Body */}
                 {/* begin::Select all and paginator*/}
                 <div className="row mx-5 my-3">
                    <div className="col-3">
                        <div className="row">
                            <button className="btn btn-secondary" onClick={() => {
                                allSelectRows();
                                props.onAllSelectRows()
                            }}
                            >
                                Seleccionar todo
                            </button>
                        </div>
                    </div>
                </div>
                 {/* begin::Select all and paginator*/}
                 {/* begin::Select all and paginator*/}
                 <div className="row mx-5 my-3">
                     <div className="col-3">
                         <div className="row">
                             <button className="btn btn-primary" onClick={() => { 
                                 /*if (currentModelList) {
                                     let aux = [...currentModelList];
                                     aux.forEach(item => {
                                     item.isSelect = false;
                                     });
                                     setCurrentModelList(aux);
                                 }*/
                                 props.onDeleteSelects()
                              }}>Eliminar</button>
                         </div>
                     </div>
                 </div>
                 {/* begin::Select all and paginator*/}
             </div>
         </>
     );
 }
 
 export default TableOnlyActionComponent;