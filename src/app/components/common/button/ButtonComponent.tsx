import React from "react";

interface ButtonComponentProps {
    text: string;
    backgroundColor: string;
    onAction(): void;
}

export const ButtonComponent = (props: ButtonComponentProps) => {
    return (
        <button 
            onClick={props.onAction}
            style={{
                backgroundColor: props.backgroundColor, 
                borderStyle: "none",
                color: "#000",
                fontSize: "1.1em", 
                margin: 0, 
                paddingBottom: "0.5em",
                paddingTop: "0.5em",
                width: "200px"
            }}
        >{props.text}</button>
    );
}

export default ButtonComponent;