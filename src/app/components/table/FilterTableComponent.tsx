/**
 * @author Raúl Júnior Bolaños Vásquez
 */

import { KTSVG } from "../../../_metronic/helpers";

interface IFilterTableComponentProps {
    query: string;
    setQuery(query: string): void;
}

export const FilterTableComponent = (props: IFilterTableComponentProps) => {

    return (
        <div className="row m-0 p-0 align-self-end px-5">    
            {/* begin::Search */}
            <div className='d-flex align-items-center position-relative my-1'>
                <KTSVG
                    path='/media/icons/duotune/general/gen021.svg'
                    className='svg-icon-1 position-absolute ms-6'
                />
                <input
                    type='text'
                    data-kt-user-table-filter='search'
                    className='form-control form-control-solid w-250px ps-14'
                    placeholder='Buscar'
                    value={props.query}
                    onChange={(e)=> props.setQuery(e.target.value)}
                />
            </div>
            {/* end::Search */}
        </div>
    );
}