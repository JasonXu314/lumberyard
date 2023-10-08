import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { FSModule } from 'src/fs/fs.module';
import { ProjectsClientController } from './projects.client.controller';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
	imports: [DataModule, FSModule],
	controllers: [ProjectsController, ProjectsClientController],
	providers: [ProjectsService],
	exports: [ProjectsService]
})
export class ProjectsModule {}

