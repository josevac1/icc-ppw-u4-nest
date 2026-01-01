import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseObject = exceptionResponse as Record<string, unknown>;

        // Caso: Error de validación con class-validator
        if (Array.isArray(responseObject.message)) {
          message = 'Datos de entrada inválidos';
          details = this.extractValidationErrors(responseObject.message);
        } else if (typeof responseObject.message === 'string') {
          message = responseObject.message;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      // Error no controlado
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error: HttpStatus[status] || 'Internal Server Error',
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(messages: unknown[]): Record<string, string> {
    const errors: Record<string, string> = {};

    messages.forEach((msg) => {
      if (
        typeof msg === 'object' &&
        msg !== null &&
        'property' in msg &&
        'constraints' in msg
      ) {
        const validationError = msg as Record<string, unknown>;
        const property = validationError.property;
        const constraints = validationError.constraints;

        if (
          typeof property === 'string' &&
          typeof constraints === 'object' &&
          constraints !== null
        ) {
          const firstConstraint = Object.values(constraints)[0];
          errors[property] = String(firstConstraint);
        }
      } else if (typeof msg === 'string') {
        // Formato string simple
        const parts = msg.split(' ');
        errors[parts[0]] = msg;
      }
    });

    return errors;
  }
}
