import { Module } from '@nestjs/common';
import { FSModule } from 'src/fs/fs.module';
import { DataService } from './data.service';

@Module({
	imports: [FSModule],
	controllers: [],
	providers: [DataService],
	exports: [DataService]
})
export class DataModule {}

