import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService, HospitalService } from '../../services/service.index';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUpload: ModalUploadService) {

    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => this.hospitales = hospitales);

    activatedRoute.params.subscribe(params => {

      let id = params['id'];

      if (id != 'nuevo') {
        this.cargarMedico(id);
      }

    });

  }

  ngOnInit() {

    this.modalUpload.notificacion
      .subscribe( resp => {

        this.medico.img = resp.medico.img;
      });

  }

  guardarMedico(f: NgForm) {


    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
      .subscribe((resp:any) => {
        
        this.medico._id = resp._id;

        this.router.navigate(['/medico/', resp._id]);
        
      });
  }

  cambioHospital(hospitalId: string) {

    this.hospitalService.obtenerHospital(hospitalId)
      .subscribe(hospital => this.hospital = hospital);
  }

  cargarMedico(id: string) {

    this.medicoService.cargarMedico(id)
      .subscribe(medico => {

        this.medico = medico
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital(this.medico.hospital);
      });

  }

  cambiarFoto() {

    this.modalUpload.mostrarModal('medicos', this.medico._id);


  }


}
