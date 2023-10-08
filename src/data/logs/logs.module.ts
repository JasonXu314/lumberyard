import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { FSModule } from 'src/fs/fs.module';
import { ProjectsModule } from '../projects/projects.module';
import { LogsClientController } from './logs.client.controller';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
	imports: [DataModule, FSModule, ProjectsModule],
	controllers: [LogsController, LogsClientController],
	providers: [LogsService],
	exports: [LogsService]
})
export class LogsModule {}

