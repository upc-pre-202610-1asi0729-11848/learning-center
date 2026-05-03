import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

/**
 * Provides reusable HTTP error translation for infrastructure services.
 */
export abstract class ErrorHandlingEnabledBaseType {
  /**
   * Creates an operation-specific HTTP error handler.
   * @param operation - Name of the failed operation.
   * @returns Function that transforms an {@link HttpErrorResponse} into a failed observable.
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;
      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.status || 'Unexpected error'}`;
      }
      return throwError(() => new Error(errorMessage));
    }
  }
}
