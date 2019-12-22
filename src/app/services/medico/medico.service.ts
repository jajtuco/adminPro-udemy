import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, retry } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';
import { Medico } from 'src/app/models/medico.model';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(public http: HttpClient,
    public usuarioService: UsuarioService) { }

  cargarMedicos() {

    let url = URL_SERVICIOS + '/medico';

    return this.http.get(url)
      .pipe(map((resp: any) => {

        this.totalMedicos = resp.total;

        return resp.medicos;
      }))
  }

  buscarMedicos(termino: string) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.medicos)
      );
  }

  borrarMedico(id: string) {

    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete(url).pipe(map(resp => {

      swal.fire({
        title: 'Médico borrado',
        text: 'Eliminado correctamente',
        icon: "info"
      });

      return resp;

    }));

  }

  guardarMedico(medico: Medico) {

    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      //Actualizando
      url += '/' + medico._id;
      url += '?token=' + this.usuarioService.token;

      return this.http.put(url, medico )
      .pipe(map( (resp:any) => {

        console.log("desde el servicio",resp.medico);
        swal.fire({
          title: 'Médico actualizado',
          text: 'Actualizado correctamente',
          icon: "info"
        });

        return resp.medico;

      }));

    } else {
      //Creando

      url += '?token=' + this.usuarioService.token;

      return this.http.post(url, medico)
        .pipe(map((resp: any) => {

          swal.fire({
            title: 'Médico creado',
            text: 'Creado correctamente',
            icon: "info"
          });
          return resp.medico;
        }));
    }

  }

  cargarMedico(id: string) {

    let url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.medico));
  }

}
