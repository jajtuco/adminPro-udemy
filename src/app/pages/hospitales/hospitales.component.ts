import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  cargando: boolean = false;
  totalRegistros: number = 0;

  constructor(public hospitalService: HospitalService,
    public  modalUploadService: ModalUploadService) { }

  ngOnInit() {

    this.cargarHospitales();

    this.modalUploadService.notificacion
    .subscribe( () => this.cargarHospitales() );

  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;

    }
    this.hospitalService.buscarHospital(termino)
      .subscribe(hospitales => this.hospitales = hospitales);
  }


  cargarHospitales() {


    this.cargando = true;

    this.hospitalService.cargarHospitalesDesde(this.desde)
      .subscribe( hospitales => {

        this.hospitales = hospitales;
        this.cargando = false;
      });

  }


  guardarHospital(hospital: Hospital) {

    this.hospitalService.actualizarHospital(hospital)
      .subscribe();


  }

  borrarHospital(hospital: Hospital) {

    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(() => this.cargarHospitales());

  }

  crearHospital() {

    swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del Hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((valor) => {
      if (!valor.value || valor.value.length === 0) {
        return;
      }
      this.hospitalService.crearHospital(valor.value)
        .subscribe(() => this.cargarHospitales());
    });
  }


  actualizarImagen( hospital:Hospital ){

    this.modalUploadService.mostrarModal( 'hospitales', hospital._id )

  }



  cambiarDesde(valor: number) {

    let desdeNuevo = this.desde + valor;

    if (desdeNuevo >= this.hospitalService.totalHospitales) {
      return;
    }
    if (desdeNuevo < 0) {
      return;
    }

    this.desde += valor;

    this.cargarHospitales();

  }

}