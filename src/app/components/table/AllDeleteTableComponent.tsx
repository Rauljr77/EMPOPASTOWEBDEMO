/**
 * @author Raúl Júnior Bolaños Vásquez.
 */

 export interface IAllSelectTableComponentProps {
    onAction(): void;
}

export const AllDeleteTableComponent = (props: IAllSelectTableComponentProps) => {
    return (
        <div className="row mx-5 my-3">
            <div className="col-3">
                <div className="row">
                    <button className="btn btn-primary" onClick={props.onAction}>Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default AllDeleteTableComponent;