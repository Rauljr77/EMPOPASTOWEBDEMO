/**
 * @author Raúl Júnior Bolaños Vásquez.
 */
import { KTSVG } from "../../../_metronic/helpers";

export interface IHeaderTableComponentProps {
    title  : string;
    textAdd: string;
    onNew(): void;
}

export const HeaderTableComponent = (props: IHeaderTableComponentProps) => {
    return (
        <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>{props.title}</span>
            </h3>
            <div
                className='card-toolbar'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='Sincronizar rutas'
                >
                <button
                    className='btn btn-sm btn-light-primary'
                    onClick={props.onNew}
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                    {props.textAdd}
                </button>
            </div>     
        </div>
    );
}

export default HeaderTableComponent;