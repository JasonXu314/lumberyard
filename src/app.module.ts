import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataModule } from './data/data.module';
import { LogsModule } from './data/logs/logs.module';
import { ProjectsModule } from './data/projects/projects.module';
import { FSModule } from './fs/fs.module';

@Module({
	imports: [DataModule, FSModule, ProjectsModule, LogsModule],
	controllers: [AppController],
	providers: []
})
export class AppModule {}

