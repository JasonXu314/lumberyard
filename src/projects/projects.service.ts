import { BadRequestException, Injectable } from '@nestjs/common';
import { DATA_DIR } from 'src/data/constants';
import { LogLevel, Project } from 'src/data/data.models';
import { DataService } from 'src/data/data.service';
import { FSService } from 'src/fs/fs.service';
import { normalize } from 'src/utils/utils';
import { CreateProjectDTO } from './dtos';

@Injectable()
export class ProjectsService {
	public constructor(private readonly data: DataService, private readonly fs: FSService) {}

	public getProject(id: string): Project | null {
		return this.data.projects.find((project) => project.id === id) || null;
	}

	public getProjects(): Project[] {
		return this.data.projects;
	}

	public makeProject({ name, retention, ...data }: CreateProjectDTO): void {
		if (data.tag.length !== data.color.length || data.color.length !== data.severity.length) {
			throw new BadRequestException('Must have same number of tags as colors as severities');
		}

		const logLevels = data.tag.map<LogLevel>((tag, i) => ({ tag, severity: data.severity[i], color: data.color[i] }));

		const newProject: Project = { name, id: normalize(name), retention, logLevels };

		this.fs.ensureDir(`${DATA_DIR}/${newProject.id}`);
		this.data.projects = [...this.data.projects, newProject];
	}
}

