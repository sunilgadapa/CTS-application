import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor( private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(catchError(error => {
            if (error) {
                
                switch (error.status) {
                    // case 400:
                    //     if (error.error.errors) {
                    //         const modalStateErrors = [];
                    //         for (const key in error.error.errors) {
                    //             if (error.error.errors[key]) {
                    //                 modalStateErrors.push(error.error.errors[key]);
                    //             }
                    //         }
                    //         this.toastr.error(error.error.Message, error.status)
                    //         throw modalStateErrors;                           
                    //     }
                    //     else {
                    //         this.toastr.error(error.error.Message, error.status)
                    //     }
                    //     break;
                    // case 400:
                    //     this.toastr.error('Invalid request')
                    //     break;
                    case 300:
                        this.toastr.error(error.error.Message,error.status)
                        break;
                    case 401:
                        this.toastr.error(error.error.Message,error.status)
                        break;
                    case 404:
                        //this.toastr.error(error.error.Message)
                        break;
                    case 500:
                        this.toastr.error('Internal Server Error')                          
                        break;
                    case 409:
                        this.toastr.error('file is already uploaded')                          
                        break;
                    default:                                            
                        break;
                }                                      
            }            
            return throwError(error);
        }))
    }
}