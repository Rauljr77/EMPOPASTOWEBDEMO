import { Modal } from 'react-bootstrap'
import Formulario from './Formulario';

const UserModalAdd = ({show, handleClose, data, handleSave, perfiles, isEdit }:any) => {
     
  return (
    <>
      <Modal show={show} onHide={handleClose} className="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Formulario user={data} handleClose={handleClose} handleSave={handleSave} perfilesData={perfiles} isEdit={isEdit}/>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UserModalAdd
