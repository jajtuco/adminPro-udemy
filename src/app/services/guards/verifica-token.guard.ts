import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {
  
  constructor( public usuarioService: UsuarioService, 
    public router: Router){}
  
  
  
  canActivate():  Promise<boolean> | boolean {
    
    
    // Decodifica el base64 para obtener la fecha de expiración del token
    let token = this.usuarioService.token;
     let payload = JSON.parse( atob( token.split('.')[1] ));

     let expirado = this.tokenExpirado( payload.exp );
 
     if( expirado ){
       this.router.navigate(['/login']);
       return false;
     }
     




    return this.verificaRenueva( payload.exp);
  }

  verificaRenueva( fechaExp:number ) : Promise<boolean> {

    return new Promise((resolve, reject)=> {

      let tokenExp = new Date( fechaExp*1000 );
      let ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 4*60*60*1000) );

      if( tokenExp.getTime() > ahora.getTime() ){
        resolve(true);
      } else {
        this.usuarioService.renuevaToken()
          .subscribe( ()=>{
            resolve(true);
          }, ()=>{
            this.router.navigate(['/login']);
            reject(false);
          });
      }


    });

  }


  tokenExpirado( fechaExp: number ){

    let ahora = new Date().getTime() / 1000;

    // Token expirado
    if( fechaExp < ahora ){
      return true;
    }else {
      return false;
    }

  }
  

}
