import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsHexColor, IsInt, IsNotIn, IsPositive, IsString, MinLength } from 'class-validator';
import { fi } from 'src/utils/utils';

export class CreateProjectDTO {
	@IsString()
	@MinLength(1)
	@IsNotIn(['projects.json'])
	name: string = fi();

	@IsInt()
	@IsPositive()
	retention: number = fi();

	@IsString({ each: true })
	tag: string[] = fi();

	@IsInt({ each: true })
	@Transform(({ value }) =>
		value.map((e: string) => {
			const num = Number(e);

			if (num < 0) {
				throw new BadRequestException('Each value in severity must be nonnegative');
			}

			return num;
		})
	)
	severity: number[] = fi();

	@IsHexColor({ each: true })
	color: string[] = fi();
}

