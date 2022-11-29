import * as Yup from 'yup';
import clsx from 'clsx';
import iconoEmpopasto from '../../../assets/iconoEmpopasto.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AxiosResponse } from 'axios';
import { IRequestAuthToken, IChangePasswordModel, IRequestBase } from '../../../types/General';
import { getToken } from '../../../services/authToken.service';
import { cambioPassword } from '../../../services/backOffice.service';
import { toast } from 'react-toastify';
import { CONFIG_TOAST } from '../../../constants/ConfigToast';

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(8, 'Maximum 8 symbols')
    .required('Password is required'),
  newPassword: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(8, 'Maximum 8 symbols')
    .required('Password is required'),
  confirmNewpassword: Yup.string()
  .oneOf([Yup.ref("newPassword"), null], "Las contraseñas no coinciden"),
})

let initialValuesPassword = {
    currentPassword     : '',
    newPassword         : '',
    confirmNewpassword  : ''
}

interface changePasswordProps {
    initialPass : string;
    userName : string;
    setVisibleLogin(value: boolean) : void;
}

export function ChangePassword(props: changePasswordProps) {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValuesPassword,
    validationSchema: changePasswordSchema,
    enableReinitialize: true,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        if (props.userName) {
            if( props.initialPass === values.currentPassword ){
            const updatePassword: IChangePasswordModel = {
                userName: props.userName,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmNewpassword: values.confirmNewpassword
            };
            const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
            if (_responseAuth.data.isAuthSuccessful) {
                const _responseChange: AxiosResponse<IRequestBase<null>> = await cambioPassword(updatePassword, _responseAuth.data.token);
                if (_responseChange.data.success) {
                    toast.success(_responseChange.data.message, CONFIG_TOAST);
                    props.setVisibleLogin(true);
                    navigate("/login");
                } else {
                    toast.error(_responseChange.data.message, CONFIG_TOAST);
                }
            } else {
                toast.error(_responseAuth.data.errorMessage, CONFIG_TOAST);
            }
        }else{
            toast.error('El password actual no coincide', CONFIG_TOAST)
            setLoading(false)
        }
        }
      } catch (error) {
        toast.error("Error en la plataforma contáctese con el administrador", CONFIG_TOAST);
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })
  return (
    <>
        <form
            className='form'
            style={{width: "75%", maxWidth: "700px"}}
            onSubmit={formik.handleSubmit}
            noValidate
            id='kt_login_signin_form'
        >
            <div className='container'>
            {/* begin::Heading */}
            <div className='row p-0 m-0 justify-content-center'>
                <img src={iconoEmpopasto} alt="Icono Empopasto" style={{width: "70px", height: "105px"}}/>
            </div>
            {/* begin::Heading */}
            {/* begin::Separator */}
            <div className='separator separator-content my-14'>
                <label className='form-label fw-bolder text-light fs-2 mb-0'>Cambiar la contraseña</label>
            </div>
            {/* end::Separator */}
            <label className='form-label text-light fs-5 mb-0'>Por favor introducir una contraseña máximo de 8 caracteres</label>
            {/* begin::Form group */}
            <div className='fv-row mb-3'>
                <label className='form-label fw-bolder text-light fs-6 mb-0'>Actual:</label>
                <input
                type='password'
                maxLength={8}
                autoComplete='off'
                {...formik.getFieldProps('currentPassword')}
                name='currentPassword'
                className={clsx(
                    'form-control bg-transparent',
                    {
                    'is-invalid': formik.touched.currentPassword && formik.errors.currentPassword,
                    },
                    {
                    'is-valid': formik.touched.currentPassword && !formik.errors.currentPassword,
                    }
                )}
                style={{color: "#FFF"}}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.currentPassword}</span>
                    </div>
                </div>
                )}
            </div>
            {/* end::Form group */}
            {/* begin::Form group */}
            <div className='fv-row mb-3'>
                <label className='form-label fw-bolder text-light fs-6 mb-0'>Nueva:</label>
                <input
                    type='password'
                    maxLength={8}
                    autoComplete='off'
                    {...formik.getFieldProps('newPassword')}
                    name='newPassword'
                    className={clsx(
                        'form-control bg-transparent',
                        {
                        'is-invalid': formik.touched.newPassword && formik.errors.newPassword,
                        },
                        {
                        'is-valid': formik.touched.newPassword && !formik.errors.newPassword,
                        }
                    )}
                    style={{color: "#FFF"}}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.newPassword}</span>
                    </div>
                </div>
                )}
            </div>
            {/* end::Form group */}
            {/* begin::Form group */}
            <div className='fv-row mb-3'>
                <label className='form-label fw-bolder text-light fs-6 mb-0'>Vuelva a escribir la contraseña</label>
                <input
                type='password'
                maxLength={8}
                autoComplete='off'
                {...formik.getFieldProps('confirmNewpassword')}
                name='confirmNewpassword'
                className={clsx(
                    'form-control bg-transparent',
                    {
                    'is-invalid': formik.touched.newPassword && formik.errors.confirmNewpassword,
                    },
                    {
                    'is-valid': formik.touched.newPassword && !formik.errors.confirmNewpassword,
                    }
                )}
                style={{color: "#FFF"}}
                />
                {formik.touched.confirmNewpassword && formik.errors.confirmNewpassword && (
                <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.confirmNewpassword}</span>
                    </div>
                </div>
                )}
            </div>
            {/* end::Form group */}
            {/* begin::Separator */}
            <div className='separator separator-content my-14'></div>
            {/* end::Separator */}
            {/* begin::Action */}
            <div className='d-grid mb-10'>
                <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-secondary'
                    disabled={formik.isSubmitting || !formik.isValid}
                >
                    {!loading && <span className='indicator-label'>Guardar cambios</span>}
                    {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                    )}
                </button>
            </div>
            <div className=''></div>
            {/* end::Action */}
            </div>
        </form>
    </>
  )
}
