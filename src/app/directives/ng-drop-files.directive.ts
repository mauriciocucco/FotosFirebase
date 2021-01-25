import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FileItem } from '../models/file-item.model';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @HostListener('dragover', ['$event'])
  onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this.prevenirYDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    const transferencia = this.getTransferencia(event);

    if (!transferencia) {
      return;
    }

    this.extraerArchivos(transferencia.files);
    this.prevenirYDetener(event);

    this.mouseSobre.emit(false);
  }

  private getTransferencia(evento: any) {
    return evento.dataTransfer
      ? evento.dataTransfer
      : evento.originalEvent.dataTransfer;
  }

  private extraerArchivos(archivosLista: FileList) {
    for (const propiedad of Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[parseInt(propiedad)];

      if (this.puedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }

    console.log(this.archivos);
  }

  //Validaciones
  private puedeSerCargado(archivo: File): boolean {
    if (!this.yaDropeado(archivo.name) && this.esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private prevenirYDetener(evento: any) {
    evento.preventDefault();
    evento.stopPropagation();
  }

  private yaDropeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('Ya fue agregado');
        return true;
      }
    }

    return false;
  }

  private esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }
}
