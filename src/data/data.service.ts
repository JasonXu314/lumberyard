import { ConsoleLogger, Injectable } from '@nestjs/common';
import { FSService } from 'src/fs/fs.service';
import { DATA_DIR, PROJECTS } from './constants';
import { Data, LogEntry, Project } from './data.models';

@Injectable()
export class DataService {
	private readonly logger = new ConsoleLogger('Data Service');
	private readonly data: Data;

	public constructor(private readonly fs: FSService) {
		try {
			fs.ensureDir(DATA_DIR);
		} catch (err) {
			this.logger.error('Failed to ensure data dir');
			throw new Error('Data Service failed initialization');
		}

		if (fs.exists(PROJECTS)) {
			const projects = JSON.parse(fs.read(PROJECTS)) as Project[];
			const logs = Object.fromEntries(
				projects.map((project) => {
					try {
						return [project.id, JSON.parse(fs.read(`${DATA_DIR}/${project.id}/logs.json`)) as LogEntry[]];
					} catch {
						this.logger.error(`Failed integrity check (missing ${project.id} logs.json)`);
						throw new Error('Data Service failed initialization');
					}
				})
			);

			this.data = { projects, logs };
		} else {
			this.data = { projects: [], logs: {} };
			this._flushAll();
		}
	}

	public get projects(): Project[] {
		return this.data.projects;
	}

	public set projects(newProjects: Project[]) {
		this.data.projects = newProjects;
		newProjects.forEach((project) => {
			if (!(project.id in this.data.logs)) {
				this.data.logs[project.id] = [];
				this._flushLogs(project.id);
			}
		});

		this._flushProjects();
	}

	public getLogs(project: string): LogEntry[] {
		return this.data.logs[project];
	}

	public setLogs(project: string, newLogs: LogEntry[]): void {
		this.data.logs[project] = newLogs;
		this._flushLogs(project);
	}

	private _flushAll(): void {
		try {
			this._flushProjects();
			this.data.projects.forEach((project) => this._flushLogs(project.id));
		} catch {
			this.logger.error('Failed to flush data');
		}
	}

	private _flushProjects(): void {
		try {
			this.fs.write(PROJECTS, JSON.stringify(this.data.projects, null, 4));
			this.data.projects.forEach((project) => {
				const projectDir = `${DATA_DIR}/${project.id}`;

				if (!this.fs.exists(projectDir)) {
					this.fs.mkdir(projectDir);
				} else if (!this.fs.isDir(projectDir)) {
					this.logger.error(`Project ${project.id} failed integrity check: dir obstructed by file`);
				}
			});
		} catch {
			this.logger.error('Failed to flush projects');
		}
	}

	private _flushLogs(project: string): void {
		try {
			this.fs.write(`${DATA_DIR}/${project}/logs.json`, JSON.stringify(this.data.logs[project], null, 4));
		} catch {
			this.logger.error(`Failed to flush logs for project '${project}'`);
		}
	}
}

