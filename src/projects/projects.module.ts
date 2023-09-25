import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { FSModule } from 'src/fs/fs.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
	imports: [DataModule, FSModule],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [ProjectsService]
})
export class ProjectsModule {}

