/* eslint-disable react-hooks/exhaustive-deps */
import {useState} from 'react'
import { KTSVG } from '../../../_metronic/helpers';


type SearchProps = {
  onChange : (value:string) => void;
}

const InputSearch = ({onChange}:SearchProps) => {

  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = (value:string) => {
    value = value.trimStart()
    setSearchTerm(value);
    onChange(value)  
  }

  return (
    <div className='card-title'>
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
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export default InputSearch
