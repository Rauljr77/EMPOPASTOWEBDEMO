import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormGroup, Button, Row, Col } from "react-bootstrap";
import { IPerfilDto } from "../../types/General";

export default function Formulario({
  user,
  handleClose,
  handleSave,
  perfilesData,
  isEdit,
}: any) {
  const [perfiles, setPerfiles] = useState<IPerfilDto[]>(perfilesData);
  const formSchema = Yup.object().shape({
    Usu: Yup.string()
      .min(1, `Mínimo 1 caracteres`)
      .max(20, `Máximo 20 caracteres`)
      .matches(
        /^[a-zA-Z0-9_]*$/,
        "Solo se permite letras y números"
      )
      .required("Campo Requerido"),
    Nombre: Yup.string()
      .min(5, `Mínimo 5 caracteres`)
      .max(100, `Máximo 100 caracteres`)
      .matches(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
        "Solo se permite letras"
      )
      .required("Campo Requerido"),
    CodigoInterno: Yup.string()
      .min(1, `Mínimo 1 caracter`)
      .max(20, `Máximo 20 caracteres`)
      .required("Campo Requerido"),
    numeroDocumento: Yup.string()
      .min(5, `Mínimo 5 dígitos`)
      .max(20, `Máximo 20 dígitos`)
      .matches(/^[0-9]+$/, "Solo se permite números")
      .required("Campo Requerido"),
    ConfirmarPassword: Yup.string()
      .oneOf([Yup.ref("Pa"), null], "Las contraseñas no coinciden"),
    Pa: Yup.string()
      .nullable()
      .min(3, `Mínimo 3 caracteres`)
      .max(8, `Máximo 8 caracteres`),
    Activo: Yup.boolean(),
    Perfil: Yup.string().required("Campo Requerido"),
  });

  const formSchemaNew = Yup.object().shape({
    Usu: Yup.string()
      .min(1, `Mínimo 1 caracteres`)
      .max(20, `Máximo 20 caracteres`)
      .matches(
        /^[a-zA-Z0-9_]*$/,
        "Solo se permite letras y números"
      )
      .required("Campo Requerido"),
    Nombre: Yup.string()
      .min(5, `Mínimo 5 caracteres`)
      .max(100, `Máximo 100 caracteres`)
      .matches(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
        "Solo se permite letras"
      )
      .required("Campo Requerido"),
    CodigoInterno: Yup.string()
      .min(1, `Mínimo 1 caracter`)
      .max(20, `Máximo 20 caracteres`)
      .required("Campo Requerido"),
    numeroDocumento: Yup.string()
      .min(5, `Mínimo 5 dígitos`)
      .max(20, `Máximo 20 dígitos`)
      .matches(/^[0-9]+$/, "Solo se permite números")
      .required("Campo Requerido"),
    ConfirmarPassword: Yup.string()
      .oneOf([Yup.ref("Pa"), null], "Las contraseñas no coinciden")
      .required("Campo Requerido"),
    Pa: Yup.string()
      .nullable()
      .min(8, `Mínimo 8 caracteres`)
      .max(8, `Máximo 8 caracteres`)
      .required("Campo Requerido"),
    Activo: Yup.boolean(),
    Perfil: Yup.string().required("Campo Requerido."),
  });

  const onHandleSave = (values: any) => {
    handleSave(values);
  };

  return (
    <>
      <Formik
        initialValues={user}
        validationSchema={isEdit ? formSchema : formSchemaNew}
        onSubmit={(values) => onHandleSave(values)}
      >
        <Form>
          <FormGroup>
            <label htmlFor="Usu">Usuario* </label>
            <Field
              className="form-control"
              name="Usu"
              placeholder=""
              type="text"
            />
            <ErrorMessage
              name="Usu"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="Nombre">Nombre completo* </label>
            <Field
              className="form-control"
              name="Nombre"
              placeholder=""
              type="text"
            />
            <ErrorMessage
              name="Nombre"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="CodigoInterno">Codigo interno* </label>
            <Field
              className="form-control"
              name="CodigoInterno"
              placeholder=""
              type="text"
            />
            <ErrorMessage
              name="CodigoInterno"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="numeroDocumento">Número documento* </label>
            <Field
              className="form-control"
              name="numeroDocumento"
              placeholder=""
              type="text"
            />
            <ErrorMessage
              name="numeroDocumento"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="Pa">Contraseña* </label>
            <Field
              className="form-control"
              name="Pa"
              placeholder=""
              type="password"
              maxLength={8}
            />
            <ErrorMessage
              name="Pa"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="ConfirmarPassword">Confirmar contraseña* </label>
            <Field
              className="form-control"
              name="ConfirmarPassword"
              placeholder=""
              type="password"
              maxLength={8}
            />
            <ErrorMessage
              name="ConfirmarPassword"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="Perfil">Perfil* </label>
            <Field className="form-control" as="select" name="Perfil">
              <option value={"0"} key={"0"}>
                -- Seleccione --
              </option>
              {(perfiles) && perfiles.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.nombre}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="Perfil"
              component="div"
              className="field-error text-danger"
            />
          </FormGroup>
          <br></br>
          <FormGroup>
            <label htmlFor="Activo">Activo </label>&nbsp;
            <Field type="checkbox" name="Activo" />
          </FormGroup>
          <br></br>
          <Row>
            <Col lg={6} md={6}></Col>
            <Col lg={3} md={3}>
              <Button
                color="primary"
                className="mr-1 mb-1 btn-block"
                type="submit"
              >
                Guardar
              </Button>
            </Col>
            <Col lg={3} md={3}>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Formik>
    </>
  );
}
