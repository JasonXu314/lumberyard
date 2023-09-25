import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { FSModule } from './fs/fs.module';
import { LogsModule } from './projects/logs/logs.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
	imports: [DataModule, FSModule, ProjectsModule, LogsModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}

