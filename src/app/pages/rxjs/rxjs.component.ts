import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy{


  subscription: Subscription;


  constructor() {


     

    // Pipe permite definir operadores 
    this.subscription = this.regresaObservable().pipe(
      retry(2)
    ).subscribe(

      //El suscribe recibe tres callbacks:
      numero => console.log("Subs", numero),              // Cuando llamamos a next()
      error => console.error('Error en el obs', error),  // Cuando llamamos a error()
      () => console.log('El observador termino')         // Cuando llamamos a complete()

    );


  }

  ngOnInit() {
  }

  ngOnDestroy() {
    //Se dispara cada vez que dejo la pagina
    this.subscription.unsubscribe();
    
  }


  regresaObservable(): Observable<any> {



    return new Observable((observer) => {

      let contador = 0;

      let intervalo = setInterval(() => {

        contador += 1;

        // const salida = {
        //   valor: contador 
        // }

        // Notifica al suscriptor que hay un dato (es como el resolve de la promesa)
        observer.next(contador);


        if (contador === 3) {
          clearInterval(intervalo);

          // Detengo el suscriptor
          observer.complete();
        }

        if (contador === 2) {
          // clearInterval(intervalo);

          // Envío un error al suscriptor
          observer.error('Auxilio');
        }

      }, 1000);

    }).pipe(
      // map( resp => resp.valor),
      filter((valor:number, index:number) => {

        if( (valor % 2) === 1) {
          // Impar
          return true;
        }else {
          // Par
          return false;
        }
      })
    );


  }

}
