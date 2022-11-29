/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers";
import { IPerfilDto } from "../../types/General";
import { IUserDto } from "../../types/GeneralTemp";
import InputSearch from "./InputSearch";
interface IUser extends IUserDto {
  selected?: boolean | null;
  perfil?: string | null;
}

interface IDataTable {
  id: number;
  estado: number;
  numeroSerie: string;
  nombre: string;
  usuario?: string | null;
  idUsuario?: number | null;
  codigo?: string | null;
}

type Props = {
  className?: string;
  dataTable: IUser[];
  perfiles: IPerfilDto[];
  allSelected: boolean;
  onActivate: (id: string, calue: boolean) => void;
  onSelected: (id: string, calue: boolean) => void;
  onEdit: (id: number) => void;
  onNewUser: () => void;
  handleSearchChange: (value: string) => void;
};

const UserTable: React.FC<Props> = ({
  className,
  dataTable,
  perfiles,
  allSelected,
  onActivate,
  onSelected,
  onEdit,
  onNewUser,
  handleSearchChange,
}: Props) => {
  const handleChangeState = (e: any) => {
    onActivate(e.target.value, e.target.checked);
  };

  const handleChangeSelected = (e: any) => {
    onSelected(e.target.value, e.target.checked);
  };

  dataTable.map((item) => {
    let perfilAux = perfiles.find((perfil) => perfil.id == item.perfilId);
    if (perfilAux) {
      item.perfil = perfilAux.nombre;
    }
  });

  return (
    <>
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
              //data-bs-toggle='modal'
              //data-bs-target='#kt_modal_user_add'
              onClick={onNewUser}
            >
              <KTSVG
                path="/media/icons/duotune/arrows/arr075.svg"
                className="svg-icon-3"
              />
              Nuevo usuario
            </a>
          </div>
        </div>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">Usuarios</span>
          </h3>
          <InputSearch onChange={handleSearchChange} />
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className="card-body py-3">
          {/* begin::Table container */}
          <div className="table-responsive">
            {/* begin::Table */}
            <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
              {/* begin::Table head */}
              <thead>
                <tr className="fw-bold text-muted">
                  <th className="w-25px">
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input widget-9-check"
                        type="checkbox"
                        value={`0`}
                        checked={allSelected}
                        onChange={handleChangeSelected}
                      />
                    </div>
                  </th>
                  <th className="min-w-150px">Código</th>
                  <th className="min-w-140px">Usuario</th>
                  <th className="min-w-120px">Nombre usuario</th>
                  <th className="min-w-120px">Perfil</th>
                  <th className="min-w-120px">Activo</th>
                  <th className="min-w-100px text-end">Acciones</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {dataTable.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          className="form-check-input widget-9-check"
                          type="checkbox"
                          value={`${item.id}`}
                          checked={item.selected ? true : false}
                          onChange={handleChangeSelected}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="d-flex justify-content-start flex-column">
                          <a
                            href="#"
                            className="text-dark fw-bold text-hover-primary fs-6"
                          >
                            {item.codigo}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-dark fw-bold text-hover-primary d-block fs-6"
                      >
                        {item.login}
                      </a>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-dark fw-bold text-hover-primary d-block fs-6"
                      >
                        {item.nombreApellido}
                      </a>
                    </td>
                    <td>
                      <a className="text-dark fw-bold text-hover-primary d-block fs-6">
                        {item.perfil}
                      </a>
                    </td>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          className="form-check-input widget-9-check"
                          type="checkbox"
                          value={item.id}
                          checked={item.estado === 0 ? false : true}
                          onChange={handleChangeState}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end flex-shrink-0">
                        <a
                          href="#"
                          className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          onClick={() => onEdit(item.id)}
                        >
                          <KTSVG
                            path="/media/icons/duotune/art/art005.svg"
                            className="svg-icon-3"
                          />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
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
  );
};

export { UserTable };
