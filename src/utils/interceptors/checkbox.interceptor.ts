import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CheckboxInterceptor implements NestInterceptor {
	public constructor(private readonly scope: 'query' | 'body', private readonly fields: string[]) {}

	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const http = context.switchToHttp();
		const req = http.getRequest<Request>();

		for (const field of this.fields) {
			req[this.scope][field] = req[this.scope][field] === 'on';
		}

		return next.handle();
	}
}

