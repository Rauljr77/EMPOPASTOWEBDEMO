import React, { FC, useEffect, useRef, useState } from "react";
import { KTSVG } from "../../../_metronic/helpers";

const SearchMessage = ({enviarDatos, mensajes, novedadMensajes}:any) => {
  const dataMessages = mensajes;

  const [data, setData] = useState<any[]>(dataMessages);
  const [dataFilter, setDataFilter] = useState(data);
  const [selectedMessages, setSelectedMessages] = useState<any[]>(novedadMensajes);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (value: string) => {
    value = value.trimStart().toLowerCase();
    let aux = data.filter((item) =>
      item.descripcion.toLowerCase().includes(value)
    );
    setSearchTerm(value);
    setDataFilter(aux);
  };

  const cambioMensaje = (e:any) => {
    console.log('Elemento seleccionado: ', e.target.id)
    console.log('Selected MEssages: ', selectedMessages)
    const indexAux = selectedMessages.findIndex((item) => item.id.toString() === e.target.id);
    console.log('Index Aux: ', indexAux);
    if( indexAux < 0){
        const index = data.findIndex((item) => item.id.toString() === e.target.id);
        if (index >= 0) {
            setSelectedMessages([...selectedMessages, data[index]])            
        }
    }
  }

  useEffect(()=>{
    enviarDatos(selectedMessages)
  },[selectedMessages])

  const tagSelected = (e:any) => {
    console.log('Tag seleccionado: ', e.target.id);
    let aux = [...selectedMessages];
    const newSelectedMessage = aux.filter((item) => item.id.toString() !== e.target.id)
    setSelectedMessages(newSelectedMessage)      
    
    
  }

  return (
    <>
      <hr></hr>
      <form
        data-kt-search-element="form"
        className="w-100 position-relative mb-3"
        autoComplete="off"
      >
        <KTSVG
          path="/media/icons/duotune/general/gen021.svg"
          className="svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 translate-middle-y ms-0"
        />

        <input
          type="text"
          className="form-control form-control-flush ps-10"
          name="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <span
          className="position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-1"
          data-kt-search-element="spinner"
        >
          <span className="spinner-border h-15px w-15px align-middle text-gray-400" />
        </span>

        <span
          className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none"
          data-kt-search-element="clear"
        >
          <KTSVG
            path="/media/icons/duotune/arrows/arr061.svg"
            className="svg-icon-2 svg-icon-lg-1 me-0"
          />
        </span>
      </form>
      <div className="mb-4" data-kt-search-element="main">
        <div className="d-flex flex-stack fw-bold mb-4">
          <span className="text-muted fs-6 me-2">Mensajes encontrados:</span>
        </div>

        <div className="scroll-y mh-200px mh-lg-100px">
          {dataFilter.map((item) => {
            return (
              <div className="d-flex align-items-center mb-5" key={item.id}>
                <div className="symbol symbol-40px me-4">
                  <span className="symbol-label bg-light">
                    <KTSVG
                      path="/media/icons/duotune/general/gen005.svg"
                      className="svg-icon-2 svg-icon-primary"
                    />
                  </span>
                </div>

                <div className="d-flex flex-column">
                  <a
                    onClick={cambioMensaje}
                    href='#'
                    id={item.id.toString()}
                    className="fs-6 text-gray-800 text-hover-primary fw-bold"
                  >
                    {item.descripcion}
                  </a>
                  <span className="fs-7 text-muted fw-bold">
                    #{item.id} - {item.nombre}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center d-none">
          <div className="pt-10 pb-10">
            <KTSVG
              path="/media/icons/duotune/files/fil024.svg"
              className="svg-icon-4x opacity-50"
            />
          </div>

          <div className="pb-15 fw-bold">
            <h3 className="text-gray-600 fs-5 mb-2">No result found</h3>
            <div className="text-muted fs-7">
              Please try again with a different query
            </div>
          </div>
        </div>
      </div>
      <hr />
      
          {selectedMessages.map((item) => (
            <div className='d-flex align-items-center mb-5' key={item.id}>
            <a
              onClick={tagSelected}
              href='#'
              id={item.id.toString()}
              className='btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2'
              key={item.id}
            >
              <i id={item.id.toString()} onClick={tagSelected} className="bi bi-x-square-fill fs-2x"></i>
              {item.descripcion}              
            </a>
            </div>
            
                ))}   
            { (selectedMessages) && (<hr />)}         
          
    </>
  );
};

export { SearchMessage };
