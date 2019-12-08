import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img';

    // Si no recibe ninguna imagen 
    if (!img) {
      return url + '/usuarios/noimg';
    }


    // Imagen de usuario de google, retorna la url
    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        break;
      case 'medico':
        url += '/medicos/' + img;
        break;
      case 'hospital':
        url += '/hospitales/' + img;
        break;

      default:
        console.log("tipo de imagen no existe, usuarios, medicos, hospitales");
        url += '/usuarios/noimg';
        break;
    }

    return url;

  }

}
