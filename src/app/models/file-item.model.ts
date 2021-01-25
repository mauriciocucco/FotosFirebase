export class FileItem {
  archivo: File;
  nombreArchivo: string;
  url: string;
  estaSubiendo: boolean;
  progreso: number;

  constructor(archivo: File) {
    this.archivo = archivo;
    this.nombreArchivo = archivo.name;
    this.estaSubiendo = false;
    this.progreso = 0;
  }
}
