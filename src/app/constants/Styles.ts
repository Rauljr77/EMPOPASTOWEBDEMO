export const DATAGRID_STYLE = {
  border: 0,
    '& .MuiDataGrid-row': {
    borderStyle: 'none',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottomColor: '#E4E6EF',
    borderBottomStyle: 'dashed',
    borderBottomWidth: '1px',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#A1A5B7',
    fontSize: '1.1rem',
  },
  '& .MuiDataGrid-row.Mui-selected': {
    background:' #FFFFFF',
    border: '1px solid #73A0FF',
    borderRadius:' 27px',
  },
  '& .MuiDataGrid-cell': {
    borderBottomColor: '#E4E6EF',
    borderBottomStyle: 'dashed',
    borderBottomWidth: '1px',
    color: '#181C32',
    fontWeight: 700,
    fontSize: '1.095rem',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  }
}