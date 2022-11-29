import * as Yup from 'yup';
import clsx from 'clsx';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IPerfilDto, IRequestAuthToken, IRequestBase } from '../../types/General';
import { ESTADO } from '../../constants/Estado';
import { useFormik } from 'formik';
import { getToken } from '../../services/authToken.service';
import { AxiosResponse } from 'axios';
import { updatePerfil } from '../../services/perfiles.service';
import { toast } from 'react-toastify';
import { CONFIG_TOAST } from '../../constants/ConfigToast';
import { IRow } from './ProfilePage.utils';
import "react-toastify/dist/ReactToastify.css";

const createSchema = Yup.object().shape({
    codigoInterno: Yup.string()
      .max(50, 'Máximo 50 caracteres')
      .required('Código es requerido'),
    nombrePerfil: Yup.string()
      .max(50, 'Máximo 50 caracteres')
      .required('Perfil es requerido'),
    activo: Yup.boolean(),
    descripcion: Yup.string()
      .notRequired()
})

export interface editProfileProps {
    textAcceptButton                : string;
    textCancelButton                : string;
    data                            : IRow;
    isVisible                       : boolean;
    onSuccess(item: IRow)           : void;
    onCancel()                      : void;
}

export const EditProfile = (props: editProfileProps) => {
    const [loading, setLoading] = useState(false);

    let initialValues = {
        codigoInterno: '',
        nombrePerfil: '',
        activo: false,
        descripcion: ''  
    };

    initialValues.codigoInterno = props.data.codigo;
    initialValues.activo = props.data.estado === ESTADO.ACTIVO? true : false;
    initialValues.descripcion = props.data.descripcion;
    initialValues.nombrePerfil = props.data.nombre;

    const isDifferent = (original: IRow, current: IPerfilDto): boolean => {
        if (original.codigo !== current.codigo) return true; 
        if (original.descripcion !== current.codigo) return true;
        if (original.estado !== current.estado) return true;
        if (original.nombre !== current.nombre) return true;
        return false;
    }

    const formik = useFormik({
        initialValues,
        validationSchema: createSchema,
        enableReinitialize: true, 
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            
            const data: IPerfilDto = {
                id: props.data.id,
                codigo: values.codigoInterno,
                nombre: values.nombrePerfil.toUpperCase(),
                estado: values.activo ? ESTADO.ACTIVO : ESTADO.INACTIVO,
                descripcion: values.descripcion.toUpperCase(),
                fechaCreacion: props.data.fechaCreacion,
                fechaModificacion: props.data.fechaModificacion
            };

            if (isDifferent(props.data, data)) {
                setLoading(true);
                try {
                    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
                    const _response: AxiosResponse<IRequestBase<null>> = await updatePerfil(data, _responseAuth.data.token);
                    if (_response.data.success) {
                        toast.success(`Se actualizó el perfil de manera correcta`, CONFIG_TOAST);
                        setLoading(false);
                        const _item: IRow = {
                            isSelect: props.data.isSelect,
                            id: props.data.id,
                            codigo: values.codigoInterno,
                            nombre: values.nombrePerfil.toUpperCase(),
                            estado: values.activo ? ESTADO.ACTIVO : ESTADO.INACTIVO,
                            estadoBoolean: values.activo,
                            descripcion: values.descripcion,
                            fechaCreacion: props.data.fechaCreacion,
                            fechaModificacion: props.data.fechaModificacion
                        }
                        props.onSuccess(_item);
                    } else {
                        toast.error('Hubo un error al actualizar el perfil', CONFIG_TOAST);
                        setLoading(false);
                    }
                } catch (error) {
                    setStatus('Hubo un error');
                    setSubmitting(false);
                    setLoading(false);
                    toast.error("Hubo un error");
                }
            }
        }
    });

    return (
        <>
            <Modal 
                className="my-modal"
                show={props.isVisible} 
                onHide={() => {
                    formik.resetForm();
                    props.onCancel();
                }}
                backdrop='static'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar Perfil</Modal.Title>
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
                                        {'is-invalid': formik.touched.codigoInterno && formik.errors.codigoInterno},
                                        {
                                          'is-valid': formik.touched.codigoInterno && !formik.errors.codigoInterno,
                                        }
                                    )}
                                    placeholder=''
                                    {...formik.getFieldProps('codigoInterno')}
                                    type='text'
                                    autoComplete='off'
                                    maxLength={50}
                                />
                                {formik.touched.codigoInterno && formik.errors.codigoInterno && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.codigoInterno}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mt-3 mb-3 p-0'>
                            <label className='col-3 col-form-label'>Perfil*: </label>
                            <div className='col-9'>
                                <input
                                    className={clsx(
                                        'form-control bg-transparent',
                                        {'is-invalid': formik.touched.nombrePerfil && formik.errors.nombrePerfil},
                                        {
                                          'is-valid': formik.touched.nombrePerfil && !formik.errors.nombrePerfil,
                                        }
                                      )}
                                    placeholder=''
                                    {...formik.getFieldProps('nombrePerfil')}
                                    type='text'
                                    name='nombrePerfil'
                                    autoComplete='off'
                                    maxLength={50}
                                />
                                {formik.touched.nombrePerfil && formik.errors.nombrePerfil && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.nombrePerfil}</span>
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

                        <div className='row mt-3 mb-3 p-0'>
                            <label className='col-3 col-form-label'>Descripción: </label>
                            <div className='col-9'>
                                <input
                                    className='form-control bg-transparent'
                                    placeholder=''
                                    {...formik.getFieldProps('descripcion')}
                                    type='text'
                                    autoComplete='off'
                                    maxLength={50}
                                />
                                {formik.touched.descripcion && formik.errors.descripcion && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.descripcion}</span>
                                    </div>
                                )}
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
                                    <button 
                                        className="btn btn-secondary" 
                                        type='button'
                                        onClick={() => {
                                            formik.resetForm()
                                            props.onCancel()}}
                                    >
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

export default EditProfile;