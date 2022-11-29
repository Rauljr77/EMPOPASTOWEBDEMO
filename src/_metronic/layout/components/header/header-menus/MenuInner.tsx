import { useIntl } from "react-intl";
import { LOCAL_ENVIRONMENT } from "../../../../../app/constants/ConfigApi";
import { KTSVG } from "../../../../helpers";
import { MenuInnerWithSub } from "./MenuInnerWithSub";
import { MenuItem } from "./MenuItem";

export function MenuInner() {
  const intl = useIntl();
  return (
    <>
      <MenuInnerWithSub
        title="Administración del sistema"
        to="/admin"
        menuPlacement="bottom-start"
        menuTrigger="click"
      >
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/users"
          title="Administración de usuarios"
        />
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/profile-admin"
          title="Perfiles"
        />
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/permission-admin"
          title="Administración de permisos"
        />
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/company-admin"
          title="Administración información empresa"
        />
        <div className="menu-item me-lg-3">
          <div>
            <a
              href={`${LOCAL_ENVIRONMENT}/Archivos/manual.pdf`}
              target="_blank"
              className="menu-link py-3 menu-here"
            >
              <span className="menu-icon">
                <KTSVG
                  path="/media/icons/duotune/general/gen051.svg"
                  className="svg-icon-2"
                />
              </span>
              Manual de usuario
            </a>
          </div>
        </div>
      </MenuInnerWithSub>
      <MenuInnerWithSub
        title="Administración de operaciones"
        to="/admin"
        menuPlacement="bottom-start"
        menuTrigger="click"
      >
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/novelty-admin"
          title="Administración de novedades"
        />
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/terminal-admin"
          title="Administración de terminal móvil"
        />
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/devices-admin"
          title="Administración de asignación de terminales"
        />
      </MenuInnerWithSub>
      <MenuInnerWithSub
        title="Operaciones"
        to="/admin"
        menuPlacement="bottom-start"
        menuTrigger="click"
      >
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/gestion-rutas"
          title="Gestión de Rutas"
        />
        <MenuItem
          icon="/media/icons/duotune/general/gen051.svg"
          to="/consulta-rutas"
          title="Consulta Rutas"
        />
      </MenuInnerWithSub>
    </>
  );
}
