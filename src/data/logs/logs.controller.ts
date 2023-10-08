import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateLogDTO } from './dtos';
import { LogsService } from './logs.service';
import { LogEntry } from './models';

@Controller('/api/:id/logs')
export class LogsController {
	constructor(private readonly service: LogsService) {}

	@Post('/')
	public async createLogAPI(@Param('id') id: string, @Body() data: CreateLogDTO): Promise<LogEntry> {
		return this.service.makeLog(id, data);
	}
}

