import { useState } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { IEmpresaDto } from "../../types/General";

const EditCompanyModal = ({ show, handleClose, data, handleSave }: any) => {

  const onHandleSave = (values: any) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("", selectedFile);
    }
    handleSave(values, formData);
  };

  const [initialValues, setInitialValues] = useState<IEmpresaDto>(data);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const forgotPasswordSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(1, "Mínimo 1 caracter")
      .max(20, "Máximo 20 caracteres")
      .required("Nombre requerido"),
    descripcion: Yup.string()
      .min(1, "Mínimo 1 caracter")
      .max(200, "Máximo 200 caracteres")
  });

  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      onHandleSave(values);
    },
  });

  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Administrar información empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            noValidate
            id="kt_login_password_reset_form"
            onSubmit={formik.handleSubmit}
          >
            {/* begin::Title */}
            {hasErrors === true && (
              <div className="mb-lg-15 alert alert-danger">
                <div className="alert-text font-weight-bold">
                  Sorry, looks like there are some errors detected, please try
                  again.
                </div>
              </div>
            )}

            {hasErrors === false && (
              <div className="mb-10 bg-light-info p-8 rounded">
                <div className="text-info">
                  Sent password reset. Please check your email
                </div>
              </div>
            )}
            {/* end::Title */}

            {/* begin::Form group */}
            <div className="fv-row mb-8">
              <label className="form-label fw-bolder text-gray-900 fs-6">
                Nombre*:{" "}
              </label>
              <input
                type="text"
                placeholder=""
                autoComplete="off"
                {...formik.getFieldProps("nombre")}
                className={clsx(
                  "form-control bg-transparent",
                  {
                    "is-invalid": formik.touched.nombre && formik.errors.nombre,
                  },
                  {
                    "is-valid": formik.touched.nombre && !formik.errors.nombre,
                  }
                )}
              />
              {formik.touched.nombre && formik.errors.nombre && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.nombre}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}
            {/* begin::Form group */}
            <div className="fv-row mb-8">
              <label className="form-label fw-bolder text-gray-900 fs-6">
                Descripción:{" "}
              </label>
              <textarea
                placeholder=""
                autoComplete="off"
                {...formik.getFieldProps("descripcion")}
                className={clsx(
                  "form-control bg-transparent",
                  { "is-invalid": formik.touched.descripcion && formik.errors.descripcion },
                  {
                    "is-valid": formik.touched.descripcion && !formik.errors.descripcion,
                  }
                )}
              />
                            {formik.touched.descripcion && formik.errors.descripcion && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.descripcion}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}
            <div className="fv-row mb-8">
              <label className="form-label fw-bolder text-gray-900 fs-6">
                Logo:{" "}
              </label>
            </div>
            <div className="fv-row mb-8">
            <input type="file" name="file" onChange={changeHandler} />
            </div>
          <hr></hr>

            {/* begin::Form group */}
            <div className="d-flex flex-wrap justify-content-center pb-lg-0">
              <button
                type="submit"
                id="kt_password_reset_submit"
                className="btn btn-primary me-4"
              >
                <span className="indicator-label">Guardar</span>
                {loading && (
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
              <button
                type="button"
                id="kt_login_password_reset_form_cancel_button"
                className="btn btn-light"
                onClick={handleClose}
                //disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancelar
              </button>
            </div>
            {/* end::Form group */}
          </form>

         
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default EditCompanyModal;
