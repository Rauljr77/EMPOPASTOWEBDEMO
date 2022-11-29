/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import { IUserDto } from '../../types/GeneralTemp';
import InputSearch from '../prueba/InputSearch';

interface IDataTable {
    terminalUsuarioId: number;
    terminalId: number;
    nombre: string;
    numeroSerie: string;
    usuarioId?: number | null | string;
    asignacion?: string | null;
    perfilId?: number | null | string;
    lectorId?: number | null;
    lector?: string | null;
    estadoTerminal: string;
    estado: boolean;
    isSelected?: boolean;
  }

type Props = {
  className?: string;
  dataTable: IDataTable[];
  onActivate : (id:string, value:boolean) => void;
  onSelected : (id:string, value:boolean, data:IDataTable) => void;
  onEdit : (id:number) => void;
  handleSearchChange : (value: string) => void;
}

const DevicesTable: React.FC<Props> = ({className, dataTable, onActivate, onSelected, onEdit, handleSearchChange }:Props) => {

    const handleChangeState = (e:any) => { 
        onActivate(e.target.value, e.target.checked)
    }

    const handleChangeSelected = (e:any, data:IDataTable) => {
        onSelected(e.target.value, e.target.checked, data)
    }

    return (
        <>
        <div className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Administración de asignación de terminales moviles</span>
            </h3>
            <InputSearch onChange={handleSearchChange} />
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                <tr className='fw-bold text-muted'>
                    <th className='w-25px'>
                    </th>
                    <th className='min-w-150px'>Número de serie</th>
                    <th className='min-w-140px'>Nombre terminal</th>
                    <th className='min-w-120px'>Asignación</th>
                    <th className='min-w-120px'>Lector Asociado</th>
                    {/* <th className='min-w-120px'>Estado</th> */}
                    <th className='min-w-120px'>Activo</th>
                    <th className='min-w-100px text-end'>Acciones</th>
                </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                {dataTable.map((item) =>
                    <tr key={item.terminalId}>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={`${item.terminalUsuarioId}`} checked={(item.isSelected) ? true : false } onChange={(e) => handleChangeSelected(e,item)} />
                            </div>
                        </td>
                        <td>
                            <div className='d-flex align-items-center'>
                                <div className='d-flex justify-content-start flex-column'>
                                <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                                    {item.numeroSerie}
                                </a>
                                </div>
                            </div>
                        </td>
                        <td>
                            <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {item.nombre}
                            </a>
                        </td>
                        <td>
                            <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {item.asignacion}

                            </a>
                        </td>
                        {/* <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                {
                                    item.estadoTerminal
                                }
                            </a>
                        </td> */}
                         <td>
                            <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {item.lector}

                            </a>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.terminalUsuarioId} checked={item.estado} onChange={handleChangeState} />
                            </div>
                        </td>
                        <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                            <a
                                href='#'
                                className='btn btn-bg-light btn-active-color-primary btn-sm me-1'
                                onClick={()=>onEdit(item.terminalId)}
                                >
                                <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                                Asignar/Modificar
                                </a>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
                {/* end::Table body */}
            </table>
            {/* end::Table */}
            </div>
            {/* end::Table container */}
        </div>
        {/* begin::Body */}
        </div>
    </>

    )
}

export {DevicesTable}
