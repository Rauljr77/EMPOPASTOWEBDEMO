export interface IRequestBase<T> {
    success : boolean;
    message : string | null;
    data    : T | null;
}

export interface IRequestAuthToken {
    isAuthSuccessful: boolean;
    errorMessage    : string;
    token           : string;
    tokenType       : string;
    expiresIn       : string;
}
export interface IAuthModel {
    key     : string;
    apikey  : string;
}

export interface IChangePasswordModel {
    userName            : string;
    currentPassword     : string;
    newPassword         : string;
    confirmNewpassword  : string;
}

export interface IEstadoTerminal {
    id      : number;
    nombre  : string;
    estado  : number;
}

export interface ILoginModel {
    userName: string;
    password: string;
}

export interface IModuloDto {
    id                  : number;
    nombre              : string;
    descripcion         : string;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface IPerfilDto {
    id                  : number;
    codigo              : string;
    nombre              : string;             
    descripcion         : string;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface IPermisoDto {
    id                  : number;
    perfilId            : number;
    moduloId            : number;
    estado              : number;
    consultar           : number;
    crear               : number;
    editar              : number;
    eliminar            : number;
    fechaCreacion       ?: string;
    fechaModificacion   ?: string;
}


export interface IPermisoFullDto extends IPermisoDto {
    perfiles: IPerfilDto;
    modulos : IModuloDto;      
}

/**
 * @deprecated Será reemplazado por ITerminal
 */
export interface ITerminalDto {
    id                  : number;
    codigo              : string;
    nombre              : string;
    numeroSerie         : string;
    estado              : number;
    estadoTerminalId    : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface ITerminal {
    id                  : number;
    codigo              : string;
    nombre              : string;
    numeroSerie         : string;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface IUsuarioDto {
    id                  : number;
    codigo              : string;
    tipoDocumentoId     : number;
    numeroDocumento     : string;
    login               : string;
    password            : string | null;
    nombreApellido      : string;
    perfilId            : number;
    estado              : number;
    estadoClave         : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
    intentos            : number;
    empresaId           : number;
}

export interface INovedadDto {
    id                  : number;
    codigo              : string;
    nombre              : string;
    alto                : number;
    bajo                : number;
    negativo            : number;
    cero                : number;
    normal              : number;
    sinLectura          : number;
    requiereMensaje     : number;
    requiereFoto        : number;
    mensajeId           : number;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
    isSelected?         : boolean;
}

export interface IMensajeDto {
    id                  : number;
    nombre              : string;
    descripcion         : string;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface INovedadMensajeFull {
    id                  : number;
    mensajeId           : number;
    novedadId           : number;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
    mensajes            : IMensajeDto;
    novedades           : INovedadDto;
}

export interface INovedadMensaje {
    id                  : number;
    mensajeId           : number;
    novedadId           : number;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface INovedadForm {
    codigo: string;
    nombre: string;
    estado: boolean;
  }

export interface ILector {
    id                  : number;
    codigo              : string;
    nombre              : string;
    descripcion         : string | null;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
}

export interface ITerminalUsuarios {
    id                  : number;
    usuarioId           : number;
    terminalId          : number;
    lectorId            : number;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
    }

export interface ITerminalUsuariosFull {
    id                  : number;
    usuarioId           : number;
    terminalId          : number;
    lectorId            : number;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
    usuarios            : IUsuarioDto;
    terminales          : ITerminal;
    lectores            :  ILector;
}

export interface ILecturaDto {
    id                  : number;
    cargaId             : string;
    ciclo_1             : string;
    blanco_1            : string;
    lector              : string;
    ciclo_2             : string;
    mes                 : string;
    anio                : string;
    simbolo             : string;
    codigoUsuario       : string;
    causalLectura       : number;
    detalleLectura      : string;
    fechaTomaLectura    : string;
    horaTomaLectura     : string;
    codigoInternoLector : string;
    latitud             : string;
    longitud            : string;
    enviadaApi          : string;
    registroFotografico : string;
    sinLectura          : boolean;
    novedadId           : number;
    mensajeId           : number;
    nombreArchivo       : string;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;  
}

export interface IGestionRutas {
    id              : number;
    nombreRuta      : string;
    nombreZona      : string;
    cantidadPredios : number;
    codigoPeriodo   : number;
    codigoTerminal  : string;
    nombreUsuario   : string;
    lector          : number;
    estado          : number;
}

export interface IConsultaRuta {
    id          : number;
    ruta        : string;
    fecha       : string;
    terminada   : boolean;
}

export interface IRuta {
    id                  : number;
    nombre              : string;
    estado              : number;
    fechaCreacion       : string | null;
    fechaModificacion   : string | null;    
}

export interface IWriteRuta {
    id              : number;
    nombreArchivo   : string;
    estado          : number;
}

export interface IEmpresaDto {
    id                  : number;
    codigo              : string;
    nombre              : string;
    nit                 : string;
    logo                : string;
    descripcion         : string;
    estado              : number;
    fechaCreacion       : string;
    fechaModificacion   : string;
  }