import { Module } from '@nestjs/common';
import { FSService } from './fs.service';

@Module({
	imports: [],
	controllers: [],
	providers: [FSService],
	exports: [FSService]
})
export class FSModule {}

