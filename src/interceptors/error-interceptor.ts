import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular/components/alert/alert-controller";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage: StorageService, public alertCtrl: AlertController) {   
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {
            let erropObj = error;
            if(erropObj.error) {
                erropObj = erropObj.error;
            }
            if (!erropObj.status) {
                erropObj = JSON.parse(erropObj);
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(erropObj);

            switch(erropObj.status){           
                case 401:
                this.handle401();
                break;

                case 403:
                this.handle403();
                break;  
                
                default:
                this.handleDefaultError(erropObj);
                break;
            }

            return Observable.throw(error);
        }) as any;
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    handleDefaultError(erropObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + erropObj.status + ': ' +erropObj.error,
            message: erropObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }
    
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};