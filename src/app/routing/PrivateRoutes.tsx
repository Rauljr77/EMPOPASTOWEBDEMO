import {FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import NoveltyAdminPage from '../pages/novelty-admin/NoveltyAdminPage'
import TerminalPage from '../pages/terminal/TerminalPage'
import DevicesAdminPage from '../pages/devices-admin/DevicesAdminPage'
import CompanyAdminPage from '../pages/company-admin/CompanyAdminPage'
import AdminProfilePage from '../pages/profile/ProfilePage'
import GestionRutas from '../pages/gestion-rutas/GestionRutas'
import PermissionPage from '../pages/permission/PermissionPage'
import UserAdminPageCopy from '../pages/user-admin/UserAdminPageCopy'
import ConsultaRutaPage from '../pages/consulta-rutas/ConsultaRutaPage'
import DeviceAdminPageCopy from '../pages/devices-admin/DeviceAdminPageCopy'
import NoveltyAdminPageCopy from '../pages/novelty-admin/NoveltyAdminPageCopy'

const PrivateRoutes = () => {

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='' element={<Navigate to='/login' />} />
        <Route path='auth/*' element={<Navigate to='/login' />} />
        
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        
        <Route
          path='/users'
          element={
            <SuspensedView>
              <UserAdminPageCopy />
            </SuspensedView>
          }
        />
        <Route
          path='/users-demo'
          element={
            <SuspensedView>
              <UserAdminPageCopy />
            </SuspensedView>
          }
        />
        <Route
          path='/novelty-admin'
          element={
            <SuspensedView>
              <NoveltyAdminPageCopy />
            </SuspensedView>
          }
        />
        {/* <Route
          path='/novelty-admin-demo'
          element={
            <SuspensedView>
              <NoveltyAdminPageCopy />
            </SuspensedView>
          }
        /> */}
        <Route
          path='/devices-admin'
          element={
            <SuspensedView>
              <DeviceAdminPageCopy />
            </SuspensedView>
          }
        />
        {/* <Route
          path='/devices-admin-demo'
          element={
            <SuspensedView>
              <DeviceAdminPageCopy />
            </SuspensedView>
          }
        /> */}
        <Route
          path='/permission-admin'
          element={
            <SuspensedView>
              <PermissionPage />
            </SuspensedView>
          }
        />
        <Route
          path='/terminal-admin'
          element={
            <SuspensedView>
              <TerminalPage />
            </SuspensedView>
          }
        />
        <Route
          path='/company-admin'
          element={
            <SuspensedView>
              <CompanyAdminPage />
            </SuspensedView>
          }
        />
        <Route
          path='/profile-admin'
          element={
            <SuspensedView>
              <AdminProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='/gestion-rutas'
          element={
            <SuspensedView>
              <GestionRutas/>
            </SuspensedView>
          }
        />
        <Route
          path='/consulta-rutas'
          element={
            <SuspensedView>
              <ConsultaRutaPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
