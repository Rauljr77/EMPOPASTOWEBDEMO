import * as Yup from 'yup';
import clsx from 'clsx';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ITerminal, IRequestAuthToken, IRequestBase } from '../../types/General';
import { ESTADO } from '../../constants/Estado';
import { useFormik } from 'formik';
import { getToken } from '../../services/authToken.service';
import { AxiosResponse } from 'axios';
import { createTerminal } from '../../services/terminal.service';
import { toast } from 'react-toastify';
import { CONFIG_TOAST } from '../../constants/ConfigToast';
import "react-toastify/dist/ReactToastify.css";

const createSchema = Yup.object().shape({
    numeroSerie: Yup.string()
      .max(50, 'Máximo 50 caracteres')
      .matches(/^[0-9a-zA-Z]+$/, 'Sólo letras y números')
      .required('Número serie es requerido'),
    nombreTerminal: Yup.string()
      .max(50, 'Máximo 50 caracteres')
      .required('Nombre terminal es requerido'),
    codigo: Yup.string()
      .max(50, 'Máximo 50 caracteres')
      .matches(/^[0-9a-zA-Z]+$/, 'Sólo letras y números')
      .required('Código es requerido'),
    activo: Yup.boolean(),
})

interface createTerminalProps {
    textAcceptButton                : string;
    textCancelButton                : string;
    isVisible                       : boolean;
    onSuccess(isSuccess: boolean)   : void;
    onCancel()                      : void;
}

export const CreateTerminal = (props: createTerminalProps) => {
    const initialValues = {
        numeroSerie: '',
        nombreTerminal: '',
        codigo: '',
        activo: false, 
    };
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: createSchema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setLoading(true)
            try {
                const data: ITerminal = {
                    id: 0,
                    codigo: values.codigo,
                    nombre: values.nombreTerminal.toUpperCase(),
                    estado: values.activo ? ESTADO.ACTIVO : ESTADO.INACTIVO,
                    numeroSerie: values.numeroSerie,
                    fechaCreacion: `${(new Date(Date.now())).toISOString()}`,
                    fechaModificacion: `${(new Date(Date.now())).toISOString()}`
                };
                
                const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
                const _response: AxiosResponse<IRequestBase<null>> = await createTerminal(data, _responseAuth.data.token);
                if (_response.data.success) {
                    toast.success(`Se creó el terminal de manera correcta`, CONFIG_TOAST);
                    setLoading(false);
                    props.onSuccess(true);
                    formik.resetForm();
                } else {
                    toast.error('Hubo un error al crear el terminal', CONFIG_TOAST);
                    formik.resetForm();
                    setLoading(false);
                }
            } catch (error) {
                setStatus('Hubo un error');
                setSubmitting(false);
                setLoading(false);
                toast.error("Hubo un error");
            }
        }
    });

    return (
        <>
            <Modal 
                className="my-modal"
                show={props.isVisible} 
                onHide={() => props.onCancel()}
                backdrop='static'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crear Terminal</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form 
                        className='form'
                        onSubmit={formik.handleSubmit}
                        noValidate
                    >
                        <div className='row mt-3 mb-3 p-0'>
                            <label className='col-3 col-form-label'>Código*: </label>
                            <div className='col-9'>
                                <input
                                    className={clsx(
                                        'form-control bg-transparent',
                                        {'is-invalid': formik.touched.codigo && formik.errors.codigo},
                                        {
                                          'is-valid': formik.touched.codigo && !formik.errors.codigo,
                                        }
                                    )}
                                    placeholder=''
                                    {...formik.getFieldProps('codigo')}
                                    type='text'
                                    autoComplete='off'
                                    maxLength={50}
                                />
                                {formik.touched.codigo && formik.errors.codigo && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.codigo}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mt-3 mb-3 p-0'>
                            <label className='col-3 col-form-label'>Número de serie*: </label>
                            <div className='col-9'>
                                <input
                                    className={clsx(
                                        'form-control bg-transparent',
                                        {'is-invalid': formik.touched.numeroSerie && formik.errors.numeroSerie},
                                        {
                                          'is-valid': formik.touched.numeroSerie && !formik.errors.numeroSerie,
                                        }
                                      )}
                                    placeholder=''
                                    {...formik.getFieldProps('numeroSerie')}
                                    type='text'
                                    name='numeroSerie'
                                    autoComplete='off'
                                    maxLength={50}
                                />
                                {formik.touched.numeroSerie && formik.errors.numeroSerie && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.numeroSerie}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mt-3 mb-3 p-0'>
                            <label className='col-3 col-form-label'>Nombre terminal*: </label>
                            <div className='col-9'>
                                <input
                                    className={clsx(
                                        'form-control bg-transparent',
                                        {'is-invalid': formik.touched.nombreTerminal && formik.errors.nombreTerminal},
                                        {
                                          'is-valid': formik.touched.nombreTerminal && !formik.errors.nombreTerminal,
                                        }
                                      )}
                                    placeholder=''
                                    {...formik.getFieldProps('nombreTerminal')}
                                    type='text'
                                    name='nombreTerminal'
                                    autoComplete='off'
                                    maxLength={50}
                                />
                                {formik.touched.nombreTerminal && formik.errors.nombreTerminal && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.nombreTerminal}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mt-3 mb-3 p-0'>
                            <label className='col-3 col-form-label'>Activo: </label>
                            <div className='col-9 align-self-center'>
                                <input
                                    className="form-check-input"
                                    type='checkbox'
                                    defaultChecked={initialValues.activo}
                                    {...formik.getFieldProps('activo')}
                                    
                                />
                            </div>
                        </div>

                        <div className='row mt-5 p-0 justify-content-around'>
                            <div className='col-6'>
                                <div className='row m-0 p-0'>
                                    <button
                                        type='submit'
                                        id='kt_sign_in_submit'
                                        className='btn btn-primary'
                                        disabled={formik.isSubmitting || !formik.isValid}
                                        >
                                        {!loading && <span className='indicator-label'>{props.textAcceptButton}</span>}
                                        {loading && (
                                            <span className='indicator-progress' style={{display: 'block'}}>
                                            Please wait...
                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row m-0 p-0'>    
                                    <button className="btn btn-secondary" type='button' onClick={() => props.onCancel()}>
                                        {props.textCancelButton}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                    
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateTerminal;