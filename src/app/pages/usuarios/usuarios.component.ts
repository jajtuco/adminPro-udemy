import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {


  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();

    this.modalUploadService.notificacion
    .subscribe( resp => this.cargarUsuarios());
  }


  mostrarModal( id: string ){
    this.modalUploadService.mostrarModal( 'usuarios', id );
  }


  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe((resp: any) => {

        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {

    let desdeNuevo = this.desde + valor;

    if (desdeNuevo >= this.totalRegistros) {
      return;
    }
    if (desdeNuevo < 0) {
      return;
    }

    this.desde += valor;

    this.cargarUsuarios();

  }

  buscarUsuario(termino: string) {


    if( termino.length <= 0 ){
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    
    
    this.usuarioService.buscarUsuario(termino)
    .subscribe( ( usuarios: Usuario[] ) => {
      
      this.usuarios = usuarios;
      this.cargando = false;
      });
  }

  borrarUsuario( usuario: Usuario ){

    if( usuario._id === this.usuarioService.usuario._id ){
      swal.fire({
        title: 'No se puede borrar el usuario',
        text: 'No se puede borrar a si mismo',
        icon: 'error'
      });

      return;
    }
    
    Swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de borrar a" + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        this.usuarioService.borrarUsuario( usuario._id )
        .subscribe( resp => {
          Swal.fire(
            'Borrado!',
            'El usuario ha sido borrado.',
            'success'
          );
          this.cargarUsuarios();

        });

        
      }
    })

  }

  guardarUsuario( usuario:Usuario ){

    this.usuarioService.actualizarUsuario(usuario)
    .subscribe();


  }


}
