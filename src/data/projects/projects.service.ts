import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DATA_DIR } from 'src/data/constants';
import { DataService } from 'src/data/data.service';
import { FSService } from 'src/fs/fs.service';
import { normalize } from 'src/utils/utils';
import { CreateProjectDTO, UpdateProjectDTO } from './dtos';
import { Project, withLogLevels } from './models';

@Injectable()
export class ProjectsService {
	public constructor(private readonly data: DataService, private readonly fs: FSService) {}

	public async getProject(id: string): Promise<Project | null> {
		return this.data.project.findUnique({ where: { id }, ...withLogLevels });
	}

	public async getProjects(): Promise<Project[]> {
		return this.data.project.findMany(withLogLevels);
	}

	public async makeProject({ name, retention, ...data }: CreateProjectDTO): Promise<Project> {
		if (data.tag.length !== data.color.length || data.color.length !== data.severity.length) {
			throw new BadRequestException('Must have same number of tags as colors as severities');
		}

		const id = normalize(name);
		const logLevels = data.tag.map<Prisma.LogLevelCreateManyProjectInput>((tag, i) => ({ tag, severity: data.severity[i], color: data.color[i] }));

		this.fs.ensureDir(`${DATA_DIR}/${id}`);
		return this.data.project.create({
			data: {
				id,
				name,
				retention,
				logLevels: { createMany: { data: logLevels } }
			},
			...withLogLevels
		});
	}

	public async updateProject(id: string, { name, retention, ...data }: UpdateProjectDTO): Promise<Project> {
		if (data.tag.length !== data.color.length || data.color.length !== data.severity.length) {
			throw new BadRequestException('Must have same number of tags as colors as severities');
		}

		const newId = normalize(name);
		const upsert = data.tag.map<Prisma.LogLevelUpsertWithWhereUniqueWithoutProjectInput>((tag, i) => ({
			where: { tag_projectId: { tag: data.originalTag[i] ?? tag, projectId: id } },
			update: { tag, severity: data.severity[i], color: data.color[i] },
			create: { tag, severity: data.severity[i], color: data.color[i] }
		}));

		return this.data.project.update({
			where: { id },
			data: {
				id: newId,
				name,
				retention,
				logLevels: { upsert }
			},
			...withLogLevels
		});
	}
}

