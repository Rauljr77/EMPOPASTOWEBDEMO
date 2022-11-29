import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers";
import {
  IEmpresaDto,
  IRequestAuthToken,
  IRequestBase,
} from "../../types/General";
import { getToken } from "../../services/authToken.service";
import EditCompanyModal from "./EditCompanyModal";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import {
  getAllEmpresas,
  updateEmpresa,
  uploadLogoEmpresa,
} from "../../services/empresa.service";

const CompanyAdminPage = () => {
  const [company, setCompany] = useState<IEmpresaDto>();
  const [show, setShow] = useState(false);

  const [permisos, setPermisos] = useState<IPermiso>();
  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!permisos?.editar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setShow(true);
  };

  const handleGetAllEmpresas = async () => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IEmpresaDto[]>> =
        await getAllEmpresas(_responseAuth.data.token);
      if (_response.data.data) {
        setCompany(_response.data.data[0]);
      }
    }
  };

  const handleUploadLogoEmpresa = async (data: IEmpresaDto) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> =
        await uploadLogoEmpresa(data, _responseAuth.data?.token);
      return _response;
    }
  };

  const handleUpdateEmpresa = async (data: IEmpresaDto) => {
    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<null>> = await updateEmpresa(
        data,
        _responseAuth.data?.token
      );
      return _response;
    }
  };

  useEffect(() => {
    (async () => {
      const resp = await getPermiso(
        "Administración de información de empresas"
      );
      if (resp.status) {
        setPermisos(resp.permiso);
        handleGetAllEmpresas();
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  const handleSave = async (values: any, formData: any) => {
    if (formData.get("") !== null) {
      let respLogo = await handleUploadLogoEmpresa(formData);
      if (respLogo?.data?.success) {
        values.logo = respLogo?.data?.message;
      }
    }
    let resp = await handleUpdateEmpresa(values);
    if (resp?.data?.success) {
      toast.success("Registro actualizado", CONFIG_TOAST);
      handleGetAllEmpresas();
      setShow(false);
    }
  };

  return (
    <>
      <br></br>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                {company && company.logo == "" && (
                  <img
                    src={toAbsoluteUrl("/media/logos/placeholder.jpg")}
                    alt="Logo"
                  />
                )}
                {company && company.logo !== "" && (
                  <img src={company.logo} alt="Logo" />
                )}
              </div>
            </div>

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1"
                    >
                      {company && company.nombre}
                    </a>
                  </div>
                </div>

                <div className="d-flex my-4">
                  <a
                    href="#"
                    className="btn btn-sm btn-light me-2"
                    id="kt_user_follow_button"
                    onClick={handleShow}
                  >
                    <KTSVG
                      path="/media/icons/duotune/art/art005.svg"
                      className="svg-icon-3"
                    />
                    <span className="indicator-label">Editar</span>
                  </a>
                </div>
              </div>
              <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                <a
                  href="#"
                  className="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                >
                  {company && company.descripcion}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {show && (
        <EditCompanyModal
          show={show}
          handleClose={handleClose}
          data={company}
          handleSave={handleSave}
        />
      )}
    </>
  );
};

export default CompanyAdminPage;
