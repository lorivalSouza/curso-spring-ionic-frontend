import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage: StorageService) {   
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
                case 403:
                this.handle403;
                break;
            }

            return Observable.throw(error);
        }) as any;
    }

    handle403() {
        this.storage.setLocalUser(null);
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};