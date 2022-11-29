export interface IUserDto {
    codigo: string;
    estado?: number | null;
    estadoClave: number | null;
    fechaCreacion?: string;
    fechaModificacion?: string;
    id: number;
    perfilId: number;
    tipoDocumentoId: number;
    intentos: number | null;
    login: string;
    nombreApellido: string;
    numeroDocumento: string;
    password: string | null;
  }