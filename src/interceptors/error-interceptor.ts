import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

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

            return Observable.throw(error);
        }) as any;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};