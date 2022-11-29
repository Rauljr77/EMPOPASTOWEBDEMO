/**
 * @author Raúl Júnior Bolaños Vásquez.
 */

import { useEffect, useState } from "react";
import { KTSVG } from "../../../_metronic/helpers";

/**
 * @property data Array de cualquier tipo.
 * @property tableColumn Array de tipo ITableColumn.
 * @property filterParameters Array de tipo string.
 */
export interface ITableComponentProps {
  data                                      : any[];
  columns                                   : ITableColumn[];
  textEdit                                  : string;
  nameActive                                : string;
  nameActiveProperty                        : string;
  onChangeSelect(row: any, checked: boolean): void;
  onChangeActive(row: any, checked: boolean): void;
  onEdit(row: any)                          : void;
}

/**
 * @property columnName Nombre de la columna.
 * @property columnProperty Nombre del atributo del objeto con el que se relacionará la columna.
 */
export interface ITableColumn {
  columnName: string;
  columnProperty: string;
}

/**
 * Tabla con filtro y paginador configurables, funciona con cualquier modelo de datos.
 * @param props Objeto de tipo ITableComponentProps.
 * @returns Devuelve una tabla que tiene filtro y paginador.
 */
export const TableComponent = (props: ITableComponentProps) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  return (
    <>  
      {/* begin::Table container */}
      <div className="table-responsive">
          {/* begin::Table */}
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr key={"row_head"} className="fw-bold text-muted">
                <th key={"th_key"} className="min-w-140px"></th>
                {props.columns ? (
                  props.columns.map((column, index) => {
                    return (
                      <th
                        key={`th_${index.toString()}`}
                        className="min-w-140px"
                      >
                        {column.columnName}
                      </th>
                    );
                  })
                ) : (
                  <></>
                )}
                <th key={`th_activo`} className="min-w-140px">
                  {props.nameActive}
                </th>
                <th key={`th_acciones`} className="min-w-140px">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && (
                data.map((row, rowIndex) => {
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
                          checked={row["isSelect"]}
                          onChange={(e) => props.onChangeSelect(row, e.target.checked)}
                        />
                      </td>
                      {/*Fin Primera celda la cuál es checkbox y la propiedad es boolean*/}
                      {/*Celdas intermedias*/}
                      {props?.columns.map((cell, colIndex) => {
                        return (
                          <td key={`td_c_${colIndex}_r_${rowIndex}`}>
                            <p className="text-dark fw-bold text-hover-primary d-block fs-6">
                              {row[cell.columnProperty]}
                            </p>
                          </td>
                        );
                      })}
                      {/*Fin Celdas intermedias*/}
                      {/*Penúltima celda la cuál es checkbox para activar*/}
                      <td key={`td_c_ultimate_check_r_${rowIndex}`}>
                        <input
                          id={`id_ultimate_check_${rowIndex}`}
                          className="form-check-input widget-9-check"
                          key={`row_ultimate_check_${rowIndex}`}
                          type="checkbox"
                          name={`ultimate_check_${rowIndex}`}
                          checked={row[props.nameActiveProperty]}
                          onChange={(e) => props.onChangeActive(row, e.target.checked)}
                        />
                      </td>
                      {/*Fin Penúltima celda la cuál es checkbox para activar*/}
                      {/*Última celda la cuál es button*/}
                      <td>
                        <div className="d-flex justify-content-end flex-shrink-0">
                          <button
                            className="btn btn-bg-light btn-active-color-primary btn-sm me-1"
                            onClick={() => props.onEdit(row)}
                          >
                            <KTSVG
                              path="/media/icons/duotune/art/art005.svg"
                              className="svg-icon-3"
                            />
                            {props.textEdit}
                          </button>
                        </div>
                      </td>
                      {/*Fin Última celda la cuál es button*/}
                    </tr>
                  );
                })
              )}
              {data.length <= 0 && (
                <div className="row m-0 p-0 justify-content-center">
                  <h5 className="text-center">No hay registros</h5>
                </div>
              )}
            </tbody>
          </table>
        </div>
        {/* end::Table container */}
    </>
  );
};

export default TableComponent;