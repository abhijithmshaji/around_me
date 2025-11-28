import { HttpHandler, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";


export const tokenHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    if (token) {
        req = req.clone({
            setHeaders: {
                'Authorization':  `Bearer ${token}`
            }
        })
    }
     return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.warn("⚠ Token expired or invalid. Logging out...");

        // Clear session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login with message
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      }

      return throwError(() => err);
    })
  );
}