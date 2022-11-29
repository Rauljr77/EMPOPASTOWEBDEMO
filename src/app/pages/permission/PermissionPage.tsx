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
  getPerfiles,
  getModulos,
} from "./PermissionPage.utils";
import { IModuloDto, IPerfilDto } from "../../types/General";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import DialogDefault from "../../components/common/dialog/DialogDefault";
import CreatePermission from "./CreatePermission";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import TitlePage from "../../components/common/title/TitlePage";
import EditPermission from "./EditPermission";
import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";

export const PermissionPage = () => {
  const [isAllSelect, setAllSelect] = useState<boolean>(true);
  const [isVisibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [isVisibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [isVisibleEliminarDialog, setVisibleEliminarDialog] =
    useState<boolean>(false);
  const [rows, setRows] = useState<IRow[]>([]);
  const [perfiles, setPerfiles] = useState<IPerfilDto[]>([]);
  const [modulos, setModulos] = useState<IModuloDto[]>([]);
  const [itemSelect, setItemSelect] = useState<IRow>(initItemSelect());
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search
  const [permisos, setPermisos] = useState<IPermiso>();

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

  const onInitSelect = () => {
    setItemSelect(initItemSelect());
  };

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

  const onEditModal = (isSuccess: boolean) => {
    if (isSuccess) {
      setVisibleEdit(false);
      setQuery("");
      getAll(setRows, setCurrentList);
    }
  };

  const columns = getColumns(onChangeSelect, onChangeActive, onActionEdit);

  //El objetivo de este useEffect es que se ejecute solo la primera vez
  useEffect(() => {
    (async () => {
      const resp = await getPermiso("Administración de permisos");
      if (resp.status) {
        setPermisos(resp.permiso);
        getAll(setRows, setCurrentList);
        getModulos(setModulos);
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
        <TitlePage title="Administración de Permisos" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableComponent
            title="Permisos"
            textAdd="Asociar permisos"
            onNew={() => {
              if (!permisos?.crear) {
                toast.error(
                  "No tiene permiso para ejecutar esta acción",
                  CONFIG_TOAST
                );
                return;
              }

              getPerfiles(rows, setPerfiles);
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
            text={`${isAllSelect ? "Seleccionar" : "Deseleccionar"} todos`}
            background="secondary"
            onAction={() =>
              onAllSelect(
                isAllSelect,
                rows,
                currentList,
                setAllSelect,
                setRows,
                setCurrentList
              )
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
      {perfiles.length > 0 && modulos.length > 0 && (
        <CreatePermission
          dataProfiles={perfiles}
          dataModules={modulos}
          isVisible={isVisibleCreate}
          onAccept={onActionModal}
          onCancel={onCloseModal}
        />
      )}
      {itemSelect !== undefined &&
        itemSelect !== null &&
        itemSelect.id !== 0 &&
        modulos.length > 0 && (
          <EditPermission
            dataSelect={itemSelect}
            dataModules={modulos}
            isVisible={isVisibleEdit}
            onInitSelect={onInitSelect}
            onAccept={onEditModal}
            onCancel={onCloseModal}
          />
        )}
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

export default PermissionPage;
