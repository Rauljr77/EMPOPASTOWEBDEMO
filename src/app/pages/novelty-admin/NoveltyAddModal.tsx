import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import clsx from "clsx";
import { INovedadForm } from "../../types/General";

type Props = {
  data?: INovedadForm;
  show: boolean;
  isEdit: boolean;
  handleClose: () => void;
  onSave: (data: INovedadForm) => void;
};

const NoveltyAddModal = ({
  data,
  show,
  isEdit,
  handleClose,
  onSave,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);

  let initialValues: INovedadForm = {
    codigo: "",
    nombre: "",
    estado: false,
  };

  if (isEdit && data) {
    initialValues = data;
  }

  const schema = Yup.object().shape({
    codigo: Yup.string()
      .min(1, "Mínimo 1 caracter")
      .max(10, "Máximo 10 caracteres")
      .required("Campo requerido"),
    nombre: Yup.string()
      .min(1, "Mínimo 1 caracter")
      .max(50, "Máximo 50 caracteres")
      .required("Campo requerido"),
    estado: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      onSave(values);
      formik.resetForm();
    },
  });

  return (
    <>
      <Modal show={show} onHide={handleClose} className="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>Crear Novedad</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form
            className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            noValidate
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
                Código*:{" "}
              </label>
              <input
                type="text"
                placeholder=""
                autoComplete="off"
                {...formik.getFieldProps("codigo")}
                className={clsx(
                  "form-control bg-transparent",
                  {
                    "is-invalid": formik.touched.codigo && formik.errors.codigo,
                  },
                  {
                    "is-valid": formik.touched.codigo && !formik.errors.codigo,
                  }
                )}
              />
              {formik.touched.codigo && formik.errors.codigo && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.codigo}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}
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
                Activo:{" "}
              </label>
              <div className="form-check form-check-sm form-check-custom form-check-solid">
                <input
                  className="form-check-input widget-9-check"
                  type="checkbox"
                  {...formik.getFieldProps("estado")}
                  //value={item.id}
                  //checked={item.estado === 0 ? false : true}
                  //onChange={(e) => handleChangeState(e, "estado")}
                />
              </div>
            </div>
            {/* end::Form group */}
            <hr></hr>

            {/* begin::Form group */}
            <div className="d-flex flex-wrap justify-content-end pb-lg-0">
              <button type="submit" className="btn btn-primary me-4">
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
      </Modal>
    </>
  );
};

export default NoveltyAddModal;
