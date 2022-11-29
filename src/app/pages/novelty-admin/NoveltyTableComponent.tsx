/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import { INovedadDto } from '../../types/General';
import InputSearch from '../prueba/InputSearch';

type Props = {
  className?: string;
  dataTable: INovedadDto[];
  onActivate : (id:string, value:boolean, op:string) => void;
  onEdit : (id:number) => void;
  handleSearchChange : (value : string) => void;
  onNewNovelty : () => void;
  onSelected : ( id: string, value: boolean) => void;
}

const NoveltyTable: React.FC<Props> = ({className, dataTable, onActivate, onEdit, handleSearchChange, onNewNovelty, onSelected }:Props) => {

    const handleChangeState = (e:any, op:string) => { 
        onActivate(e.target.value, e.target.checked, op)
    }

    const handleChangeSelected = (e:any) => {
        onSelected(e.target.value, e.target.checked)
    }

    return (
        <>
        <div style={{ marginTop: 50}}></div>
        <div className={`card ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1"></span>
          </h3>
          <div
            className="card-toolbar"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-trigger="hover"
            title="Click to add a user"
          >
            <a
              href="#"
              className="btn btn-sm btn-light-primary"
              onClick={onNewNovelty}
            >
              <KTSVG
                path="/media/icons/duotune/arrows/arr075.svg"
                className="svg-icon-3"
              />
              Nueva novedad
            </a>
          </div>
        </div>
        <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Novedades</span>
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
                    <th className='w-25px'></th>
                    <th className='min-w-140px'>Código</th>
                    <th className='min-w-140px'>Novedad</th>
                    <th className='min-w-120px'>Alto</th>
                    <th className='min-w-120px'>Bajo</th>
                    <th className='min-w-120px'>Negativo</th>
                    <th className='min-w-120px'>Cero</th>
                    <th className='min-w-120px'>Normal</th>
                    <th className='min-w-120px'>Sin lectura</th>
                    <th className='min-w-120px'>Requiere mensaje</th>
                    <th className='min-w-120px'>Requiere foto</th>
                    <th className='min-w-120px'>Activo</th>
                    <th className='min-w-100px text-end'>Acciones</th>
                </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                {dataTable.map((item) =>
                    <tr key={item.id}>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={`${item.id}`} checked={(item.isSelected) ? true : false } onChange={(e) => handleChangeSelected(e)} />
                            </div>
                        </td>
                        <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                {item.codigo}
                            </a>
                        </td>
                        <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                {item.nombre}
                            </a>
                        </td>
                        <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.alto===0)? false : true} onChange={(e)=>handleChangeState(e,'alto')} />
                            </div>
                        </td>
                        <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.bajo===0)? false : true} onChange={(e)=>handleChangeState(e,'bajo')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.negativo===0)? false : true} onChange={(e)=>handleChangeState(e,'negativo')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.cero===0)? false : true} onChange={(e)=>handleChangeState(e,'cero')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.normal===0)? false : true} onChange={(e)=>handleChangeState(e,'normal')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.sinLectura===0)? false : true} onChange={(e)=>handleChangeState(e,'sinLectura')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.requiereMensaje===0)? false : true} onChange={(e)=>handleChangeState(e,'requiereMensaje')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.requiereFoto===0)? false : true} onChange={(e)=>handleChangeState(e,'requiereFoto')} />
                            </div>
                        </td>
                        <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input className='form-check-input widget-9-check' type='checkbox' value={item.id} checked={(item.estado===0)? false : true} onChange={(e)=>handleChangeState(e,'estado')} />
                            </div>
                        </td>
                        <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                                <a
                                href='#'
                                className='btn btn-bg-light btn-active-color-primary btn-sm me-1'
                                onClick={()=>onEdit(item.id)}
                                >
                                <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                                Asociar/Editar
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

export {NoveltyTable}
