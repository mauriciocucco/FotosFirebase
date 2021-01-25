import { Component, OnInit } from '@angular/core';
import { CargaImagenesService } from 'src/app/services/carga-imagenes.service';
import { FileItem } from '../../models/file-item.model';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [],
})
export class CargaComponent implements OnInit {
  archivos: FileItem[] = [];
  drop: boolean = false;

  constructor(private cargaImagenesService: CargaImagenesService) {}

  ngOnInit(): void {}

  cargarImagenes() {
    this.cargaImagenesService.cargarImagenesFirebase(this.archivos);
  }

  limpiarArchivos() {
    this.archivos = [];
  }
}
