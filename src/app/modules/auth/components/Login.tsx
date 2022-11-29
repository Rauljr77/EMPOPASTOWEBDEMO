/* eslint-disable jsx-a11y/anchor-is-valid */
import * as Yup from "yup";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getUserByToken, login } from "../core/_requests";
import { useAuth } from "../core/Auth";
import { AuthModel } from "../core/_models";
import { AxiosResponse } from "axios";
import {
  IRequestAuthToken,
  ILoginModel,
  IRequestBase,
  IUsuarioDto,
} from "../../../types/General";
import { getToken } from "../../../services/authToken.service";
import { inicioSesion } from "../../../services/backOffice.service";
import { loginStorage } from "../../../utils/utilsStorage";
import { ChangePassword } from "./ChangePassword";
import { ESTADO, ESTADO_USUARIO } from "../../../constants/Estado";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../../constants/ConfigToast";
import logoMain from "../../../assets/logoMain.png";
import iconoEmpopasto from "../../../assets/iconoEmpopasto.png";
import DialogAccept from "../../../components/common/dialog/DialogAccept";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .min(1, "Mínimo 1 caracter")
    .max(50, "Máximo 50 caracteres")
    .required("Usuario es requerido"),
  password: Yup.string()
    .length(8, "Debe contener 8 caracteres")
    .required("Password is required"),
});


/**
 * .min(8, 'Debe tener 8 caracteres')
    .max(8, 'Debe tener 8 caracteres')
 */

let initialValuesLogin = {
  email: "",
  password: "",
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const [isVisibleAccept, setVisibleAccept] = useState<boolean>(false);
  const [isVisibleLogin, setVisibleLogin] = useState<boolean>(true);
  const [messageAccept, setMessageAccept] = useState<string>("");
  const [userName, setUserName] = useState<string>();
  const [initialPass, setInitialPass] = useState<string>();
  const { saveAuth, setCurrentUser } = useAuth();
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValuesLogin,
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const _responseAuth: AxiosResponse<IRequestAuthToken> =
          await getToken();
        const data: ILoginModel = {
          userName: values.email,
          password: values.password,
        };
        const _response: AxiosResponse<IRequestBase<IUsuarioDto>> =
          await inicioSesion(data, _responseAuth.data.token);
        if (_response && _response.data) {
          if (_response.data?.success) {
            setLoading(false);
            if ( _response.data.data?.estado ===  ESTADO.INACTIVO) {
              toast.error("El usuario está inactivo", CONFIG_TOAST);
            }
            else if (
              _response.data.data?.estadoClave === ESTADO_USUARIO.CAMBIO_ADMIN
            ) {
              setInitialPass(data.password);
              setUserName(data.userName);
              setVisibleLogin(false);
            } else if (
              _response.data.data?.estadoClave === ESTADO_USUARIO.CAMBIO_USUARIO
            ) {
              loginStorage(
                values.email,
                _responseAuth.data.token,
                String(_response.data.data.id)
              );
              const auth: AuthModel = await login(
                values.email,
                values.password
              );
              saveAuth(auth);
              const user = await getUserByToken(auth.api_token);
              setCurrentUser(user);
              navigate("/dashboard");
            } else if (
              _response.data.data?.estadoClave === ESTADO_USUARIO.BLOQUEADO
            ) {
              setLoading(false);
              toast.error("El usuario está bloqueado contáctese con el administrador", CONFIG_TOAST);
            } else {
              setLoading(false);
              toast.error("Contáctese con el administrador", CONFIG_TOAST);
            }
          } else {
            setLoading(false);
            toast.error(_response.data.message, CONFIG_TOAST);
          }
        } else {
          setLoading(false);
          toast.error(
            "Error de conexión, contáctese con el administrador",
            CONFIG_TOAST
          );
        }
      } catch (error) {
        console.error(error);
        saveAuth(undefined);
        setStatus("The login details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <div className="row p-0 m-0" style={{ height: "100vh" }}>
        <div className="col-6 justify-content-center align-items-center align-self-center">
          <div className="row p-0 m-0 justify-content-center">
            <div className="text-center">
              <h1 style={{ color: "#01A79F", fontSize: "3em" }}>BIENVENIDO</h1>
            </div>
          </div>
          <div className="row p-0 m-0 justify-content-center">
            <div className="text-center">
              <h1 className="fw-bolder" style={{ color: "#076F86" }}>
                PORTAL TOMA DE LECTURAS EN LINEA
              </h1>
            </div>
          </div>
          <div className="row p-0 m-0 justify-content-center">
            <img src={logoMain} alt="Logo Empopasto" />
          </div>
        </div>
        <div className="col-6" style={{ backgroundColor: "#076F86" }}>
          <div className="row p-0 m-0 justify-content-center h-100">
            <div className="col justify-content-center align-self-center">
              <div className="row p-0 m-0 justify-content-center">
                {isVisibleLogin && (
                  <form
                    className="form"
                    style={{ width: "75%", maxWidth: "700px" }}
                    onSubmit={formik.handleSubmit}
                    noValidate
                    id="kt_login_signin_form"
                  >
                    <div className="container">
                      {/* begin::Heading */}
                      <div className="row p-0 m-0 justify-content-center">
                        <img
                          src={iconoEmpopasto}
                          alt="Icono Empopasto"
                          style={{ width: "90px", height: "105px" }}
                        />
                      </div>
                      {/* begin::Heading */}
                      {/* begin::Separator */}
                      <div className="separator separator-content my-14"></div>
                      {/* end::Separator */}
                      {/* begin::Form group */}
                      <div className="fv-row mb-8">
                        {/*<label className='form-label fs-6 fw-bolder text-dark'>Username</label>*/}
                        <input
                          placeholder="Username"
                          {...formik.getFieldProps("email")}
                          className={clsx(
                            "form-control bg-transparent",
                            {
                              "is-invalid":
                                formik.touched.email && formik.errors.email,
                            },
                            {
                              "is-valid":
                                formik.touched.email && !formik.errors.email,
                            }
                          )}
                          style={{ color: "#FFF" }}
                          type="text"
                          name="email"
                          autoComplete="off"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{formik.errors.email}</span>
                          </div>
                        )}
                      </div>
                      {/* end::Form group */}
                      {/* begin::Form group */}
                      <div className="fv-row mb-3">
                        {/*<label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>*/}
                        <input
                          type="password"
                          maxLength={8}
                          autoComplete="off"
                          {...formik.getFieldProps("password")}
                          className={clsx(
                            "form-control bg-transparent",
                            {
                              "is-invalid":
                                formik.touched.password &&
                                formik.errors.password,
                            },
                            {
                              "is-valid":
                                formik.touched.password &&
                                !formik.errors.password,
                            }
                          )}
                          style={{ color: "#FFF" }}
                        />
                        {formik.touched.password && formik.errors.password && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.password}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* end::Form group */}
                      {/* begin::Action */}
                      <div className="d-grid mb-10">
                        <button
                          type="submit"
                          id="kt_sign_in_submit"
                          className="btn btn-secondary"
                          disabled={formik.isSubmitting || !formik.isValid}
                        >
                          {!loading && (
                            <span className="indicator-label">
                              Iniciar sesión
                            </span>
                          )}
                          {loading && (
                            <span
                              className="indicator-progress"
                              style={{ display: "block" }}
                            >
                              Please wait...
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                          )}
                        </button>
                      </div>
                      {/* end::Action */}
                    </div>
                  </form>
                )}
                {!isVisibleLogin && userName && initialPass && (
                  <ChangePassword
                    initialPass={initialPass}
                    userName={userName}
                    setVisibleLogin={setVisibleLogin}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogAccept
        title="Error"
        message={messageAccept}
        textAcceptButton="Aceptar"
        isVisible={isVisibleAccept}
        onAccept={() => {
          setVisibleAccept(false);
        }}
      />
    </>
  );
}
