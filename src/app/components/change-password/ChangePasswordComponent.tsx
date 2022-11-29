import React from "react";
import CSS from 'csstype';
import ButtonComponent from "../common/button/ButtonComponent";

const GREEN: string = "#46D01B";
const LIGHT_GRAY_1: string = "#B9B9B9";
const LIGHT_GRAY_2: string = "#CFCFCF";
const LIGHT_GRAY_4: string = "#EDEDED";

export const ChangePasswordComponent = () => {

    const onSaveChange = () => {
        alert("Has guardado cambios");
    };

    const onCancel = () => {
        alert("Has cancelado");
    };

    return (
        <div style={stylesContainer}>
            <h3>Cambie la contraseña</h3>
            <h4>Por favor introduzca una nueva contraseña de maximo 8 caracteres</h4>
            <div className="row mt-1 mb-1 justify-content-center">
                <div className="col-6">
                    <label htmlFor="inputActual" className="w-100 text-end">Actual</label>
                </div>
                <div className="col-6">
                    <input id="inputActual" type={"password"} placeholder="********" style={stylesInput} maxLength={8} />    
                </div>
            </div>
            <div className="row mt-1 mb-1 justify-content-center">
                <div className="col-6">
                    <label htmlFor="inputNueva" className="w-100 text-end">Nueva</label>
                </div>
                <div className="col-6">
                    <input id="inputNueva" type={"password"} placeholder="********" style={stylesInput} maxLength={8} />
                </div>
            </div>
            <div className="row mt-1 mb-1 justify-content-center">
                <div className="col-6">
                    <label htmlFor="inputConfirmar" className="w-100 text-end">Vuelva a escribir la contraseña</label>
                </div>
                <div className="col-6">
                    <input id="inputConfirmar" type={"password"} placeholder="********" style={stylesInput} maxLength={8} />
                </div>
            </div>
            <h4 style={stylesTextValidation}>Las contraseñas coinciden</h4>
            <div style={stylesHorizontalLine}></div>
            <div className="row justify-content-end mt-3">
                <ButtonComponent text="Guardar cambios" backgroundColor="#66CCCC" onAction={onSaveChange}/>
                <div style={stylesSpaceHorizontal}></div>
                <ButtonComponent text="Cancelar" backgroundColor={LIGHT_GRAY_1} onAction={onCancel}/>
            </div>
        </div>
    );
}

const stylesContainer: CSS.Properties = {
    backgroundColor: LIGHT_GRAY_4,
    borderColor: LIGHT_GRAY_2,
    borderStyle: "solid",
    borderWidth: "2px",
    display: "flex",
    flexDirection: "column",
    padding: "1.5em",
    width: "500px"
};

const stylesSpaceHorizontal: CSS.Properties = {
    width: "2em"
}

const stylesInput: CSS.Properties = {
    fontSize: "1.1em",
    padding: "0.1em",
};

const stylesTextValidation: CSS.Properties = {
    color: GREEN
};

const stylesHorizontalLine: CSS.Properties = {
    borderBottomWidth: "2px",
    borderBottomColor: LIGHT_GRAY_1,
    borderBottomStyle: "solid",
    display: "flex"
};

export default ChangePasswordComponent;