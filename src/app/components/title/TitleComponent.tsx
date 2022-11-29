import React from "react";
import CSS from "csstype";

interface TitleComponentProps {
    text: string;
    color?: string;
}

export const TitleComponent = (props: TitleComponentProps) => {
    return (
        <h2 style={styles}>{props.text}</h2>
    );
}

const MARGIN_VERTICAL: string = "1.4em";

const styles: CSS.Properties = { 
    color: "black",
    marginBottom: MARGIN_VERTICAL,
    marginTop: MARGIN_VERTICAL, 
    textAlign: "center", 
}

export default TitleComponent;