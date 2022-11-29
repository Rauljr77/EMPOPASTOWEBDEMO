import { useEffect, useState } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";
import { FilterTableComponent } from "../../components/table/FilterTableComponent";
import {
  changeActive,
  getAll,
  initItemSelect,
  IRow,
  onAllSelect,
  search,
  updateItemInLists,
  allDeletes,
  getColumns,
} from "./TerminalPage.utils";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import DialogDefault from "../../components/common/dialog/DialogDefault";
import CreateTerminal from "./CreateTerminal";
import EditTerminal from "./EditTerminal";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import TitlePage from "../../components/common/title/TitlePage";

import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";

export const TerminalPage = () => {
  const [isVisibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [isVisibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [isVisibleEliminarDialog, setVisibleEliminarDialog] =
    useState<boolean>(false);

  const [permisos, setPermisos] = useState<IPermiso>();
  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  const [rows, setRows] = useState<IRow[]>([]);
  const [itemSelect, setItemSelect] = useState<IRow>(initItemSelect());
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search

  const onChangeSelect = (row: IRow, checked: boolean) => {
    row.isSelect = checked;
    updateItemInLists(row, rows, currentList, setRows, setCurrentList);
  };

  const onChangeActive = async (row: IRow, checked: boolean) => {
    await changeActive(
      row,
      checked,
      rows,
      currentList,
      setRows,
      setCurrentList
    );
  };

  const onEditRow = (row: IRow) => {
    updateItemInLists(row, rows, currentList, setRows, setCurrentList);
    setVisibleEdit(false);
  };

  const onActionEdit = (row: IRow) => {
    if (!permisos?.editar) {
      toast.error("No tiene permiso para ejecutar esta acción", CONFIG_TOAST);
      return;
    }

    setItemSelect(initItemSelect());
    setItemSelect(row);
    setVisibleEdit(true);
  };

  const onAllDeletes = async () => {
    setVisibleEliminarDialog(false);
    allDeletes(rows, setRows, setCurrentList);
  };

  const onCloseModal = () => {
    setVisibleCreate(false);
    setVisibleEdit(false);
  };

  const onActionModal = (isSuccess: boolean) => {
    if (isSuccess) {
      setVisibleCreate(false);
      setQuery("");
      getAll(setRows, setCurrentList);
    }
  };

  const columns = getColumns(onChangeSelect, onChangeActive, onActionEdit);

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración de terminales móviles");
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

  return (
    <>
      <div className="mt-5">
        <TitlePage title="Administración de Terminal Móvil" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableComponent
            title="Terminal móvil"
            textAdd="Terminal"
            onNew={() => {
              if (!permisos?.crear) {
                toast.error(
                  "No tiene permiso para ejecutar esta acción",
                  CONFIG_TOAST
                );
                return;
              }
              setVisibleCreate(true);
            }}
          />
          <FilterTableComponent query={query} setQuery={setQuery} />
          <div className="row mx-0 my-3 px-5">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                columns={columns}
                rows={currentList}
                pageSize={5}
                rowsPerPageOptions={[5]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              />
            </div>
          </div>
          <ButtonFooterComponent
            text="Seleccionar todo"
            background="secondary"
            onAction={() =>
              onAllSelect(rows, currentList, setRows, setCurrentList)
            }
          />
          <ButtonFooterComponent
            text="Eliminar"
            background="primary"
            onAction={() => {
              if (!permisos?.eliminar) {
                toast.error(
                  "No tiene permiso para ejecutar esta acción",
                  CONFIG_TOAST
                );
                return;
              }
              setVisibleEliminarDialog(true);
            }}
          />
        </div>
      </div>
      <CreateTerminal
        isVisible={isVisibleCreate}
        textAcceptButton="Crear terminal"
        textCancelButton="Cancelar"
        onSuccess={onActionModal}
        onCancel={onCloseModal}
      />
      <EditTerminal
        isVisible={isVisibleEdit}
        data={itemSelect}
        textAcceptButton="Editar terminal"
        textCancelButton="Cancelar"
        onSuccess={onEditRow}
        onCancel={onCloseModal}
      />
      <DialogDefault
        title="¿Estás seguro de eliminar?"
        isVisible={isVisibleEliminarDialog}
        message="Pulsa en aceptar para continuar, de lo contrario pulse cancelar"
        textAcceptButton="Aceptar"
        textCancelButton="Cancelar"
        type="danger"
        onAccept={() => onAllDeletes()}
        onCancel={() => setVisibleEliminarDialog(false)}
      />
    </>
  );
};

export default TerminalPage;
