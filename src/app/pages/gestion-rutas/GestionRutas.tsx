import { useEffect, useState } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";
import { FilterTableComponent } from "../../components/table/FilterTableComponent";
import {
  getAll,
  IRow,
  search,
  getColumns,
  updateItemInLists,
  sendRoutes,
} from "./GestionRuta.utils";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import {
  IGestionRutas,
  IRequestAuthToken,
  IRequestBase,
} from "../../types/General";
import { AxiosResponse } from "axios";
import { getToken } from "../../services/authToken.service";
import { getGestionRutas } from "../../services/rutas.service";
import TitlePage from "../../components/common/title/TitlePage";

import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import { DATAGRID_STYLE } from "../../constants/Styles";

export const GestionRutaPage = () => {
  const [rows, setRows] = useState<IRow[]>([]);
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search

  const onChangeActive = (row: IRow, checked: boolean) => {
    row.activo = checked;
    updateItemInLists(row, rows, currentList, setRows, setCurrentList);
  };

  const columns = getColumns(onChangeActive);

  const [permisos, setPermisos] = useState<IPermiso>();
  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Operaciones");
      if (resp.status) {
        setPermisos(resp.permiso);
        getAll(setRows, setCurrentList);
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  useEffect(() => {
    search(query, rows, setCurrentList);
  }, [query]);

  const handleGetGestionRutas = async () => {
    if (!permisos?.crear) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    const _responseAuth: AxiosResponse<IRequestAuthToken> = await getToken();
    if (_responseAuth.data?.token) {
      const _response: AxiosResponse<IRequestBase<IGestionRutas[]>> =
        await getGestionRutas(_responseAuth.data.token);
      if (_response.data.success) {
        toast.success("Se sincronizaron las rutas", CONFIG_TOAST);
        getAll(setRows, setCurrentList);
      } else {
        toast.error("No se encontraron registros", CONFIG_TOAST);
      }
    }
  };

  return (
    <>
      <div className="mt-5">
        <TitlePage title="Gestión de Rutas" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableComponent
            title="Gestión de rutas"
            textAdd="Cargar archivos planos"
            onNew={() => handleGetGestionRutas()}
          />
          <FilterTableComponent query={query} setQuery={setQuery} />
          <div className="row mx-0 my-3 px-5">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                sx={DATAGRID_STYLE}
                columns={columns}
                rows={currentList}
                pageSize={5}
                rowsPerPageOptions={[5]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
          </div>

          <div className="row mx-5 my-3">
            <div className="col-3">
              <div className="row">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!permisos?.editar) {
                      toast.error(
                        "No tiene permiso para ejecutar esta acción",
                        CONFIG_TOAST
                      );
                      return;
                    }

                    sendRoutes(rows);
                  }}
                >
                  Activar Ruta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionRutaPage;
