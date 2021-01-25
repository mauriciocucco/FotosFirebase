import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FileItem } from '../models/file-item.model';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private carpetaImagenes = 'img';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  cargarImagenesFirebase(imagenes: FileItem[]): void {
    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }

      const file = item.archivo;
      const filePath = `${this.carpetaImagenes}/${item.nombreArchivo}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      // con esta función nos suscribimos a los cambios en el progreso
      uploadTask
        .percentageChanges()
        .subscribe((resp) => (item.progreso = resp!));

      // obtengo el url de descarga cuando este disponible
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() =>
            fileRef.getDownloadURL().subscribe((url) => {
              console.log('Imagen cargada con exito');
              item.url = url;
              item.estaSubiendo = false;
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url,
              });
            })
          )
        )
        .subscribe();
    }
  }

  private guardarImagen(imagen: { nombre: String; url: string }) {
    this.db.collection(`/${this.carpetaImagenes}`).add(imagen);
  }
}
