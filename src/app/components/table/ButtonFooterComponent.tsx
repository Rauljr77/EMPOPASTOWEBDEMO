/**
 * @author Raúl Júnior Bolaños Vásquez.
 */

 export interface IButtonFooterComponentProps {
    text: string;
    background: "info" | "primary" | "secondary" | "success" |"warning"
    onAction(): void;
}

export const ButtonFooterComponent = (props: IButtonFooterComponentProps) => {
    return (
        <div className="row mx-5 my-3">
            <div className="col-3">
                <div className="row">
                    <button className={`btn btn-${props.background}`} onClick={props.onAction}
                    >
                        {props.text}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ButtonFooterComponent;