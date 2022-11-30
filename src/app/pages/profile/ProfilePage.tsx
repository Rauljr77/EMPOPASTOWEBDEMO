import { useEffect, useState } from "react";
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
} from "./ProfilePage.utils";
import { DataGrid, esES } from "@mui/x-data-grid";
import HeaderTableComponent from "../../components/table/HeaderTableComponent";
import CreateProfile from "./CreateProfile";
import EditProfile from "./EditProfile";
import DialogDefault from "../../components/common/dialog/DialogDefault";
import ButtonFooterComponent from "../../components/table/ButtonFooterComponent";
import TitlePage from "../../components/common/title/TitlePage";
import { usePermiso, IPermiso } from "../../hooks/usePermiso";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CONFIG_TOAST } from "../../constants/ConfigToast";

export const AdminProfilePage = () => {
  const [isAllSelect, setAllSelect] = useState<boolean>(true);
  const [isVisibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [isVisibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [isVisibleEliminarDialog, setVisibleEliminarDialog] =
    useState<boolean>(false);
  const [rows, setRows] = useState<IRow[]>([]);
  const [itemSelect, setItemSelect] = useState<IRow>(initItemSelect());
  const [currentList, setCurrentList] = useState<IRow[]>([]); //  Para la tabla.
  const [query, setQuery] = useState(""); //  Para el filtro search
  const [permisos, setPermisos] = useState<IPermiso>();

  const { getPermiso } = usePermiso();
  let navigate = useNavigate();

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
    setQuery("");
    getAll(setRows, setCurrentList);
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
      const resp = await getPermiso("Administración Perfiles");
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
        <TitlePage title="Perfiles" />
        <div className="card card-xxl-stretch mb-12 mb-xl-12">
          <HeaderTableComponent
            title="Perfiles"
            textAdd="Perfil"
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

          {/*<div className="row mx-0 my-3 px-5">
            <TableComponent 
              data={currentList}
              columns={columns}
              textEdit="Editar"
              nameActive="Activo"
              nameActiveProperty="estadoBoolean"
              onChangeActive={onChangeActive}
              onChangeSelect={onChangeSelect}
              onEdit={onEditRow}
            />
          </div>*/}

          <div className="row mx-0 my-3 px-5">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                sx={{
                  border: 0,
    color: '#757575',
    fontFamily: 'Lato',
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
  '& .MuiDataGrid-row': {
   width: '1191px',
   height: '34px',
  background: '#FFFFFF',
  borderRadius: '27px',

},
'& .MuiDataGrid-iconSeparator': {
  display: 'none',
},
'& .MuiDataGrid-columnHeaders': {

  width: '1191px',
  minHeight: '34px',
  background: '#D5DFED',
  borderRadius: '20px',

},
'& .MuiDataGrid-columnHeaderTitle': {
  fontWeight: 700,
  fontSize: '14px', minHeight: '34px',
},
'& .MuiDataGrid-row.Mui-selected': {
  background:' #FFFFFF',
  border: '1px solid #73A0FF',
  borderRadius:' 27px',
},
'& .MuiDataGrid-cell': {
  fontFamily:'Lato',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17px', 
  color: '#757575',
  boxSizing: 'none',borderBottom: 'none',
},
'& .MuiPaginationItem-root': {
  borderRadius: 0,
}
                }}
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
      <CreateProfile
        isVisible={isVisibleCreate}
        textAcceptButton="Crear perfil"
        textCancelButton="Cancelar"
        onSuccess={onActionModal}
        onCancel={onCloseModal}
      />
      <EditProfile
        isVisible={isVisibleEdit}
        data={itemSelect}
        textAcceptButton="Actualizar perfil"
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

export default AdminProfilePage;
