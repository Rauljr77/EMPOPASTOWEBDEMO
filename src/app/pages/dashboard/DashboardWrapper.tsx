import {FC} from 'react';
import {useIntl} from 'react-intl';
import logoMain from '../../assets/logoMain.png';

const DashboardPage: FC = () => (
  <>
    <div className="row p-0 m-0" style={{ height: "100vh" }}>
        <div className="col-12 justify-content-center align-items-center align-self-center">
          <div className="row p-0 m-0 justify-content-center">
            <div className="text-center">
              <h1 style={{ color: "#01A79F", fontSize: "3em" }}>BIENVENIDO</h1>
            </div>
          </div>
          <div className="row p-0 m-0 justify-content-center">
            <div className="text-center">
              <h1 className="fw-bolder" style={{ color: "#076F86" }}>
                PORTAL TOMA DE LECTURAS EN LINEA
              </h1>
            </div>
          </div>
          <div className="row p-0 m-0 justify-content-center">
            <img src={logoMain} alt="Logo Empopasto" />
          </div>
        </div>
      </div>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
