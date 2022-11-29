import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import clsx from "clsx";
import { ILector, IPerfilDto } from "../../types/General";

const DeviceModal = ({
  show,
  handleClose,
  data,
  handleSave,
  users,
  perfiles,
  lectores,
}: any) => {
  interface IUser {
    codigo?: number | null;
    estado?: number | null;
    fechaCreacion?: string;
    fechaModificacion?: string;
    id: number;
    idPerfil: number;
    idTipoDocumento: number;
    login: string;
    nombreApellido: string;
    numeroDocumento: string;
    password: string | null;
    selected?: boolean | null;
  }
  const [dataUser, setDataUser] = useState(users);
  const [dataLector, setDataLector] = useState(lectores);
  const [filterData, setfilterData] = useState(users);

  const handleSelect = (e: any, op: string) => {
    if (op == "p") {
      formik.setFieldValue("perfilId", e.target.value);
      changePerfil(e.target.value);
    } else {
      formik.setFieldValue("usuarioId", e.target.value);
    }
  };

  const changePerfil = (id: number) => {
    let aux = dataUser.filter(
      (item: any) => item.perfilId.toString() == id.toString()
    );
    formik.setFieldValue("usuarioId", "0");
    setfilterData(aux);
  };

  const onHandleSave = (values: any) => {
    handleSave(values);
  };

  const Schema = Yup.object().shape({
    usuarioId: Yup.string().required("Campo requerido"),
    perfilId: Yup.string().required("Campo requerido"),
  });

  useEffect(() => {
    if (data.perfilId != "0") {
      let aux = dataUser.filter(
        (item: any) => item.perfilId.toString() == data.perfilId
      );
      setfilterData(aux);
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const formik = useFormik({
    initialValues: data,
    validationSchema: Schema,
    enableReinitialize: true,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      onHandleSave(values);
    },
  });

  return (
    <>
      <Modal show={show} onHide={handleClose} className="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>Asignación de terminales</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form
            className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            noValidate
            id="kt_login_password_reset_form"
            onSubmit={formik.handleSubmit}
          >
            <div className="row">
              <div className="col-sm-3">
                <h4>Terminal</h4>
              </div>
              <div className="col-sm-9">
                {/* begin::Form group */}

                <label className="form-label fw-bolder text-gray-900 fs-6">
                  Número de serie:{" "}
                </label>
                <input
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  disabled
                  {...formik.getFieldProps("numeroSerie")}
                  className={clsx("form-control bg-transparent")}
                />
                <label className="form-label fw-bolder text-gray-900 fs-6">
                  Nombre terminal:{" "}
                </label>
                <input
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  disabled
                  {...formik.getFieldProps("nombre")}
                  className={clsx("form-control bg-transparent")}
                />
              </div>
              <div className="col-sm-12">
                <br></br>
              </div>
              <div className="col-sm-3">
                <h4>Asignar a:</h4>
              </div>
              <div className="col-sm-9">
                <label className="form-label fw-bolder text-gray-900 fs-6">
                  Perfil:{" "}
                </label>
                <select
                  className={clsx(
                    "form-control bg-transparent",
                    {
                      "is-invalid":
                        formik.touched.perfilId && formik.errors.perfilId,
                    },
                    {
                      "is-valid":
                        formik.touched.perfilId && !formik.errors.perfilId,
                    }
                  )}
                  {...formik.getFieldProps("perfilId")}
                  onChange={(e) => handleSelect(e, "p")}
                >
                  <option value={"0"} key={"0"}>
                    --- Seleccione ---
                  </option>
                  {perfiles?.map((item: IPerfilDto) => (
                    <option value={item.id} key={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
                <label className="form-label fw-bolder text-gray-900 fs-6">
                  Usuario:{" "}
                </label>
                <select
                  className={clsx(
                    "form-control bg-transparent",
                    {
                      "is-invalid":
                        formik.touched.perfil && formik.errors.perfil,
                    },
                    {
                      "is-valid":
                        formik.touched.perfil && !formik.errors.perfil,
                    }
                  )}
                  {...formik.getFieldProps("usuarioId")}
                  onChange={(e) => handleSelect(e, "u")}
                >
                  <option value={"0"} key={"0"}>
                    --- Seleccione ---
                  </option>
                  {filterData?.map((item: IUser) => (
                    <option value={item.id} key={item.id}>
                      {item.codigo} - {item.nombreApellido}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-12">
                <br></br>
              </div>
              <div className="col-sm-3">
                <h4>Asociar a:</h4>
              </div>
              <div className="col-sm-9">
                <label className="form-label fw-bolder text-gray-900 fs-6">
                  Lector:{" "}
                </label>
                <select
                  className={clsx(
                    "form-control bg-transparent",
                    {
                      "is-invalid":
                        formik.touched.lectorId && formik.errors.lectorId,
                    },
                    {
                      "is-valid":
                        formik.touched.lectorId && !formik.errors.lectorId,
                    }
                  )}
                  {...formik.getFieldProps("lectorId")}
                >
                  <option value={"0"} key={"0"}>
                    --- Seleccione ---
                  </option>
                  {lectores?.map((item: ILector) => (
                    <option value={item.id} key={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
                <div className="col-sm-12">
                <br></br>
              </div>
              </div>
            </div>

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
      </Modal>
    </>
  );
};
export default DeviceModal;
