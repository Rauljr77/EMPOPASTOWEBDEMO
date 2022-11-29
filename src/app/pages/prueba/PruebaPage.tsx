import React, { useState, useEffect } from "react";

import { UsersTableComponent } from "./UsersTableComponent";
import InputSearch from "./InputSearch";
import { KTSVG } from "../../../_metronic/helpers";
import { UserAddModal } from "./UserAddModal";
import Button from 'react-bootstrap/Button';
import UserModalAdd from "./userModalAdd";

const PruebaPage = () => {

  const [dataTable, setDataTable] = useState([
    {
      id: 11,
      codigo: "1085293019",
      usuario: "HARCE",
      nombreUsuario: "HAMILTON ARCE",
      password: '123456',
      perfil: "PERFIL 1",
      estado: false,
    },
    {
      id: 12,
      codigo: "1085293333",
      usuario: "MARCE",
      nombreUsuario: "MARIA ARCE",
      password: '123456',
      perfil: "PERFIL 2",
      estado: false,
    },
    {
      id: 13,
      codigo: "1085282300",
      usuario: "SMARTINEZ",
      nombreUsuario: "SILAVANA MARTINEZ",
      password: '123456',
      perfil: "PERFIL 3",
      estado: false,
    },
  ]);
  
  const [data, setData] = useState([
    {
      id: 1,
      name: "Emma Smith",
      avatar: "avatars/300-6.jpg",
      email: "smith@kpmg.com",
      position: "Art Director",
      role: "Administrator",
      last_login: "Yesterday",
      two_steps: false,
      joined_day: "10 Nov 2022, 9:23 pm",
      online: false,
    },
    {
      id: 2,
      name: "Melody Macy",
      initials: {
        label: "M",
        state: "danger",
      },
      email: "melody@altbox.com",
      position: "Marketing Analytic",
      role: "Analyst",
      last_login: "20 mins ago",
      two_steps: true,
      joined_day: "10 Nov 2022, 8:43 pm",
      online: false,
    },
    {
      id: 3,
      name: "Max Smith",
      avatar: "avatars/user.png",
      email: "max@kt.com",
      position: "Software Enginer",
      role: "Developer",
      last_login: "3 days ago",
      two_steps: false,
      joined_day: "22 Sep 2022, 8:43 pm",
      online: false,
    },
    {
      id: 4,
      name: "Sean Bean",
      avatar: "avatars/300-5.jpg",
      email: "sean@dellito.com",
      position: "Web Developer",
      role: "Support",
      last_login: "5 hours ago",
      two_steps: true,
      joined_day: "21 Feb 2022, 6:43 am",
      online: false,
    },
    {
      id: 5,
      name: "Brian Cox",
      avatar: "avatars/300-25.jpg",
      email: "brian@exchange.com",
      position: "UI/UX Designer",
      role: "Developer",
      last_login: "2 days ago",
      two_steps: true,
      joined_day: "10 Mar 2022, 9:23 pm",
      online: false,
    },
    {
      id: 6,
      name: "Mikaela Collins",
      initials: {
        label: "M",
        state: "warning",
      },
      email: "mik@pex.com",
      position: "Head Of Marketing",
      role: "Administrator",
      last_login: "5 days ago",
      two_steps: false,
      joined_day: "20 Dec 2022, 10:10 pm",
      online: false,
    },
    {
      id: 7,
      name: "Francis Mitcham",
      avatar: "avatars/300-9.jpg",
      email: "f.mit@kpmg.com",
      position: "Software Arcitect",
      role: "Trial",
      last_login: "3 weeks ago",
      two_steps: false,
      joined_day: "10 Nov 2022, 6:43 am",
      online: false,
    },
    {
      id: 8,
      name: "Olivia Wild",
      initials: {
        label: "O",
        state: "danger",
      },
      email: "olivia@corpmail.com",
      position: "System Admin",
      role: "Administrator",
      last_login: "Yesterday",
      two_steps: false,
      joined_day: "19 Aug 2022, 11:05 am",
      online: false,
    },
    {
      id: 9,
      name: "Neil Owen",
      initials: {
        label: "N",
        state: "primary",
      },
      email: "owen.neil@gmail.com",
      position: "Account Manager",
      role: "Analyst",
      last_login: "20 mins ago",
      two_steps: true,
      joined_day: "25 Oct 2022, 10:30 am",
      online: false,
    },
    {
      id: 10,
      name: "Dan Wilson",
      avatar: "avatars/300-23.jpg",
      email: "dam@consilting.com",
      position: "Web Desinger",
      role: "Developer",
      last_login: "3 days ago",
      two_steps: false,
      joined_day: "19 Aug 2022, 10:10 pm",
      online: false,
    },
  ]);

  const [id, setId] = useState({});

  const [user, setUser] = useState({
    id: 1,
    name: "Emma Smith",
    avatar: "avatars/300-6.jpg",
    email: "smith@kpmg.com",
    position: "Art Director",
    role: "Administrator",
    last_login: "Yesterday",
    two_steps: false,
    joined_day: "10 Nov 2022, 9:23 pm",
    online: false
  })

  const [filterData, setfilterData] = useState(data);
  const [isLoading, setIsLoading ] = useState(true);
  const [flag, setFlag] = useState(false);

  const handleSearchChange = (value: string) => {
    value = value.toLowerCase();
    let aux = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.role.toLowerCase().includes(value)
    );
    console.log("Filter: ", aux);
    setfilterData(aux);
  };

  const handleOnActive = (id: string, estado: boolean) => {
    console.log('Event: ', id, ' - ', estado); 
   // debugger
    let aux = [...dataTable];
    const index = aux.findIndex((item) => item.id.toString() === id);
    if (index >= 0) {
      aux[index].estado = estado;
      console.log('AUX: ', aux)
      console.log('AUX_I_ndeX: ', aux[index])
      setDataTable(aux);
    }
      return <UserAddModal />
    

  };
/*
*@param: 
*/
  const handleEdit = async (id:number) => {
    console.log('ELIMINADO ', id);
    const userDelete = await dataTable.find(item => item.id === id);
    if( userDelete  ){
      setId({
        Usuario: userDelete.usuario,
        CodigoInterno: userDelete.codigo,
        Nombre: userDelete.nombreUsuario,
        Password: userDelete.password,
        Perfil: userDelete.perfil,
      })
    }
    handleShow()
  }

  const handleNewUser = () => {
    setId({
      Usuario: '',
      CodigoInterno: '',
      Nombre: '',
      Password: '',
      Perfil: ''
    })
    handleShow()    
  }

  useEffect(() => {
    console.log('DATA TABLE: ', dataTable)
  },[JSON.stringify(dataTable)])
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  let handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      let res = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          mobileNumber: mobileNumber,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setName("");
        setEmail("");
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  return (
    <>
      <div className="row gy-12 gx-xl-12">
        <div className="col-xl-12">
        <Button variant="primary" onClick={handleShow}>
           Launch demo modal
         </Button>
        {(flag) ? (
          <> 
          {/* <UserTable
            className="card-xxl-stretch mb-12 mb-xl-12"
            dataTable={dataTable}
            onActivate={handleOnActive}
            onEdit={handleEdit}
            onNewUser={handleNewUser}
          /> */}
          <UserModalAdd show={show} handleClose={handleClose} id={id}/>
          </>
          ) : (
          
            <div className={`card card-xxl-stretch mb-12 mb-xl-12`}>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-3 mb-1'>Usuarios</span>
                </h3>
                <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
              <a
                href='#'
                className='btn btn-sm btn-light-primary'
                //data-bs-toggle='modal'
                //data-bs-target='#kt_modal_user_add'
                onClick={handleNewUser}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                Cerrar
              </a>
            </div>
            </div>
            <UserModalAdd show={show} handleClose={handleClose}/>

            {/* begin::Body */}
            
            {/* <div>

            <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={mobileNumber}
          placeholder="Mobile Number"
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>

            </div> */}
            </div>
          
          
          
          )}
        </div>
      </div>
      {/* end::Row */}
      {/* <ProfileDetails /> */}
      {/* <UsersPage /> */}
      {/* <UsersTableComponent /> */}
      {/* <BuilderPageWrapper />*/}
      <InputSearch onChange={handleSearchChange} /> 
      <UsersTableComponent data={filterData} />
      {/* <TablesWidget11 className='mb-5 mb-xl-8' /> */}
      {/* <UserEditModal /> */}
    </>
  );
};

export default PruebaPage;
