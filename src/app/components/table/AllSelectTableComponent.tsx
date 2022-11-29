/**
 * @author Raúl Júnior Bolaños Vásquez.
 */

export interface IAllSelectTableComponentProps {
    onAction(): void;
}

export const AllSelectTableComponent = (props: IAllSelectTableComponentProps) => {
    return (
        <div className="row mx-5 my-3">
            <div className="col-3">
                <div className="row">
                    <button className="btn btn-secondary" onClick={props.onAction}
                    >
                        Seleccionar todo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllSelectTableComponent;