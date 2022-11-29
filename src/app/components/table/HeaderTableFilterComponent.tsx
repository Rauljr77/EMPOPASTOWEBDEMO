/**
 * @author Raúl Júnior Bolaños Vásquez.
 */

import { KTSVG } from "../../../_metronic/helpers";

export interface IHeaderTableComponentProps {
    query                           : string;
    dateBegin                       : string;
    dateEnd                         : string;
    setQuery(query: string)         : void;
    setDateBegin(dateBegin: string) : void;
    setDateEnd(dateEnd: string)     : void;
}

export const HeaderTableFilterComponent = (props: IHeaderTableComponentProps) => {
    return (
        <div className="card-header border-0 pt-5 my-5">  
            <div className="row m-0 p-0 justify-content-around px-5">    
                {/* begin:: labelTitle */}
                <div className="col-auto align-self-end">
                    <h4>Consultar Rutas:</h4>
                </div>
                {/* end:: labelTitle */}

                {/* begin::Search */}
                <div className="col-auto align-self-end">
                    <div className='d-flex align-items-center my-1'>
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
                </div>

                {/* end::Search */}

                {/* inputs calendar */}
                <div className="col-auto">
                    <div className="row justify-content-center">
                        <h4 className="text-center">Consulta por fecha:</h4>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-auto">    
                            <div className='d-flex align-items-center my-1'>
                                <KTSVG
                                    path='/media/icons/duotune/general/gen021.svg'
                                    className='svg-icon-1 position-absolute ms-6'
                                />
                                <input
                                    type='date'
                                    className='form-control form-control-solid w-250px ps-14'
                                    placeholder='Fecha inicio'
                                    value={props.dateBegin}
                                    onChange={(e)=> props.setDateBegin(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-auto">
                            <div className='d-flex align-items-center my-1'>
                                <KTSVG
                                    path='/media/icons/duotune/general/gen021.svg'
                                    className='svg-icon-1 position-absolute ms-6'
                                />
                                <input
                                    type='date'
                                    className='form-control form-control-solid w-250px ps-14'
                                    placeholder='Fecha final'
                                    value={props.dateEnd}
                                    onChange={(e)=> props.setDateEnd(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </div>
                {/* end::inputs calendar */}
            </div>
        </div>
    );
}

export default HeaderTableFilterComponent;