import { useState } from "react";
import { Field, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { SearchMessage } from "./SearchMessage";
import { KTSVG } from "../../../_metronic/helpers";
import clsx from "clsx";
import { INovedadForm } from "../../types/General";

const NoveltyModal = ({ show, handleClose, id, handleSave, novedadMensajes, mensajes }: any) => {

  console.log('novedadMensajes: ', novedadMensajes);

  const [novelty, setNovelty] = useState(id);
  const [messages, setMessages] = useState();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);

  const handleSaveModal = (values:any) => {
    handleSave(messages, values);
  }

  const enviarDatos = (datos:any) => {

    setMessages(datos);
  }

  const onSave = (values: any) => {
    console.log('SAVE MODAL: ', values);
    handleSaveModal(values)
  }

  let initialValues: INovedadForm = {
    codigo: "",
    nombre: "",
    estado: false,
  };

  if (novelty) {
    initialValues = novelty;
    console.log('INITIAL: ', initialValues);
  }

  const onChange = (e: any) => {
    console.log('EVENT: ', e.target.checked)
    formik.setFieldValue('estado', e.target.checked);
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
      console.log('VALOR: ', formik.getFieldProps('estado').value);
      setLoading(true);
      setHasErrors(undefined);
      onSave(values);
      //formik.resetForm();
    },
  });

  return (
    <>
      <Modal show={show} onHide={handleClose} className="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>Asociar novedades</Modal.Title>
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
            {/*begin::Form group */}
            <div className="fv-row mb-8">
              <label className="form-label fw-bolder text-gray-900 fs-6">
                Activo:{" "}
              </label>

              <div className="form-check form-check-sm form-check-custom form-check-solid">
                <input
                  className="form-check-input widget-9-check"
                  type="checkbox"
                  checked={(formik.getFieldProps('estado').value)}
                  //value={item.id}
                  //checked={...formik.getFieldProps("estado")}
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
            {/* end::Form group

          {/* <a
            href="#"
            className="text-dark fw-bold text-hover-primary mb-1 fs-6"
          >
            Código
          </a>
          <span className="text-muted fw-semibold d-block fs-7">
            {id.codigo}
          </span>
          <br></br>
          <a
            href="#"
            className="text-dark fw-bold text-hover-primary mb-1 fs-6"
          >
            Novedad
          </a>
          <span className="text-muted fw-semibold d-block fs-7">
            {id.nombre}
          </span> */}
          <br />
          <a
            href="#"
            className="text-dark fw-bold text-hover-primary mb-1 fs-6"
          >
            Asociar
          </a>
          <SearchMessage enviarDatos={enviarDatos} mensajes={mensajes} novedadMensajes={novedadMensajes} />
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
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveModal}>
            Guardar
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default NoveltyModal;
