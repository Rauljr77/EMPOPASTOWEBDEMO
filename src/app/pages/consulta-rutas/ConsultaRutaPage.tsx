import { useEffect, useState } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import HeaderTableFilterComponent from "../../components/table/HeaderTableFilterComponent";
import TitlePage from "../../components/common/title/TitlePage";

import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";
import {
  AllDownloads,
  getAll,
  getColumns,
  IRow,
  onAllSelect,
  search,
  updateItemInLists,
} from "./ConsultaRutaPage.utils";
import { DATAGRID_STYLE } from "../../constants/Styles";

export const ConsultaRutaPage = () => {
  const [rows, setRows] = useState<IRow[]>([]);
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search
  const [dateBegin, setDateBegin] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [permiso, setPermiso] = useState<IPermiso>();

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  const onChangeSelect = (row: IRow, checked: boolean) => {
    row.isSelect = checked;
    updateItemInLists(row, rows, currentList, setRows, setCurrentList);
  };

  const onAllDownloads = () => {
    AllDownloads(rows);
  };

  const columns = getColumns(onChangeSelect);

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Operaciones");
      if (resp.status) {
        setPermiso(resp.permiso);
        getAll(setRows, setCurrentList);
      } else {
        toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
        navigate("/dashboard");
      }
    })();
  }, []);

  useEffect(() => {
    search(query, dateBegin, dateEnd, rows, setCurrentList);
  }, [query, dateBegin, dateEnd]);

  return (
    <>
      <div className="mt-5 ">
        <TitlePage title="Consultar Rutas" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableFilterComponent
            query={query}
            dateBegin={dateBegin}
            dateEnd={dateEnd}
            setQuery={setQuery}
            setDateBegin={setDateBegin}
            setDateEnd={setDateEnd}
          />
          <div className="row mx-0 my-3 px-5">
            <div style={{ width: "100%", height: 400 }}>
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
          <ButtonFooterComponent
            text="Seleccionar todos"
            background="secondary"
            onAction={() =>
              onAllSelect(rows, currentList, setRows, setCurrentList)
            }
          />
          <ButtonFooterComponent
            text="Generar archivo"
            background="primary"
            onAction={() => {
              if (!permiso?.consultar) {
                toast.error(
                  "No tiene permiso para ejecutar esta acción",
                  CONFIG_TOAST
                );
                return;
              }

              onAllDownloads();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ConsultaRutaPage;
