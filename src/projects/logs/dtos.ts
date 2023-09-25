import { Transform } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { fi } from 'src/utils/utils';

export class CreateLogDTO {
	@IsOptional()
	@IsString()
	scope?: string;

	@IsString()
	level: string = fi();

	@IsString()
	message: string = fi();

	@IsObject()
	@Transform(({ value }) => (typeof value === 'object' ? value : typeof value === 'string' ? JSON.parse(value) : undefined))
	@IsOptional()
	jsonDump?: any;
}

export class FilterDTO {
	@IsString()
	@IsOptional()
	query?: string;

	@IsBoolean()
	byMessage: boolean = fi();

	@IsBoolean()
	byScope: boolean = fi();

	@IsBoolean()
	byJSON: boolean = fi();
}

