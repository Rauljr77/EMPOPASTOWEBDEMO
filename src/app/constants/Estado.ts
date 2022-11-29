export const ESTADO_USUARIO = {
    BLOQUEADO: 0,
    CAMBIO_ADMIN: 1,
    CAMBIO_USUARIO: 2
}

export const ESTADO: IEstado = {
    INACTIVO: 0,
    ACTIVO  : 1,
    ELIMINADO: 2
}

interface IEstado {
    INACTIVO: number;
    ACTIVO  : number;
    ELIMINADO: number;
}
