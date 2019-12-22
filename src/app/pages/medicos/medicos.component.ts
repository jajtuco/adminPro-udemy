import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  constructor( public medicosServices: MedicoService) { 

    this.cargarMedicos();
  }

  ngOnInit() {

  }

  cargarMedicos() {

    this.medicosServices.cargarMedicos()
    .subscribe( medicos => {
      this.medicos = medicos });
  }

buscarMedico( termino: string){

  if( !termino ){
    this.cargarMedicos();
    return;
  }
  this.medicosServices.buscarMedicos(termino)
  .subscribe( medicos => this.medicos = medicos );
}

borrarMedico(medico: Medico ){
  this.medicosServices.borrarMedico( medico._id)
  .subscribe( () => this.cargarMedicos() );
}

crearMedico( a: any){

}

}
