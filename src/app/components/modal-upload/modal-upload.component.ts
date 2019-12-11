import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor(public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService) {


  }

  ngOnInit() {
  }


  seleccionImagen(archivo: File) {



    if (!archivo) {

      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf("image/") < 0) {
      swal.fire({
        title: 'Sólo imágenes',
        text: "El archivo seleccionado no es una imagen",
        icon: 'error'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;


    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  subirImagen() {

    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then(resp => {

        this.modalUploadService.notificacion.emit( resp );
        this.cerrarModal();
        
      }).catch(err => {
        console.log("Error en la carga...");
      });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this.modalUploadService.ocultarModal();
  }


}
