import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DATA_DIR } from 'src/data/constants';
import { DataService } from 'src/data/data.service';
import { FSService } from 'src/fs/fs.service';
import { LOGFILE_DAY_FORMAT, composeLogMessage, todayLogFile } from 'src/utils/utils';
import { CreateLogDTO } from './dtos';
import { LogEntry, defaultSelect } from './models';

export interface LogFilterOptions {
	query: string;
	byMessage: boolean;
	byScope: boolean;
	byJSON: boolean;
	levelOptions: Record<string, 'Show Matching' | 'Always Show' | 'Never Show'>;
}

@Injectable()
export class LogsService {
	public constructor(private readonly data: DataService, private readonly fs: FSService) {}

	public async getLogs(project: string, { query, byMessage, byScope, byJSON, levelOptions }: LogFilterOptions): Promise<LogEntry[]> {
		const q = query.toLowerCase();

		const logs = await this.data.logEntry.findMany({
			where: {
				projectId: project
			},
			orderBy: { timestamp: 'asc' },
			...defaultSelect
		});

		return logs.filter((entry) => {
			if (levelOptions[entry.level.tag] === 'Never Show') {
				return false;
			}

			const values = [
				byMessage ? entry.message : null,
				byScope ? entry.scope ?? null : null,
				byJSON ? (entry.jsonDump ? JSON.stringify(entry.jsonDump) : null) : null
			].filter<string>((e): e is string => e !== null);

			return (
				levelOptions[entry.level.tag] === 'Always Show' ||
				values.some((value) => {
					const vws = value.replace(/\s/g, '');
					const qws = q.replace(/\s/g, '');
					const vFrags = value.split(/\s/);
					const qFrags = q.split(/\s/);

					return (
						value.includes(q) ||
						q.includes(value) ||
						vws.includes(qws) ||
						qws.includes(vws) ||
						qFrags.every((f) => vFrags.some((fragment) => fragment.includes(f) || f.includes(fragment)))
					);
				})
			);
		});
	}

	public async makeLog(project: string, { level, message, jsonDump, scope }: CreateLogDTO): Promise<LogEntry> {
		const now = DateTime.now();
		const timestamp = now.toJSDate();

		const newEntry = await this.data.logEntry.create({
			data: {
				projectId: project,
				logLevel: level,
				message,
				jsonDump,
				scope,
				timestamp
			},
			...defaultSelect
		});
		this.fs.append(`${DATA_DIR}/${project}/${todayLogFile()}`, composeLogMessage(newEntry));
		this._cleanup(project);

		return newEntry;
	}

	private async _cleanup(project: string): Promise<void> {
		const { retention } = await this.data.project.findUniqueOrThrow({ where: { id: project } });
		const logFiles = this.fs
			.readdir(`${DATA_DIR}/${project}`)
			.filter((file) => file.endsWith('.log'))
			.sort((a, b) => {
				const aDate = DateTime.fromFormat(a.split('.')[0], LOGFILE_DAY_FORMAT),
					bDate = DateTime.fromFormat(b.split('.')[0], LOGFILE_DAY_FORMAT);

				return +aDate - +bDate;
			});

		if (logFiles.length > retention) {
			const oldest = logFiles.at(-1)!;
			const purgedDay = DateTime.fromFormat(oldest.split('.')[0], LOGFILE_DAY_FORMAT);

			await this.data.logEntry.deleteMany({ where: { AND: [{ projectId: project }, { timestamp: { gte: purgedDay.toJSDate() } }] } });
			this.fs.rm(oldest);
		}
	}
}

