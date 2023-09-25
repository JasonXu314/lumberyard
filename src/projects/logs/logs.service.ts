import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DATA_DIR } from 'src/data/constants';
import { LogEntry } from 'src/data/data.models';
import { DataService } from 'src/data/data.service';
import { FSService } from 'src/fs/fs.service';
import { LOGFILE_DAY_FORMAT, composeLogMessage, todayLogFile } from 'src/utils/utils';
import { CreateLogDTO } from './dtos';

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

	public getLogs(project: string, { query, byMessage, byScope, byJSON, levelOptions }: LogFilterOptions): LogEntry[] {
		const q = query.toLowerCase();

		return this.data.getLogs(project).filter((entry) => {
			if (levelOptions[entry.level] === 'Never Show') {
				return false;
			}

			const values = [
				byMessage ? entry.message : null,
				byScope ? entry.scope ?? null : null,
				byJSON ? (entry.jsonDump ? JSON.stringify(entry.jsonDump) : null) : null
			].filter<string>((e): e is string => e !== null);

			return (
				levelOptions[entry.level] === 'Always Show' ||
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

	public makeLog(project: string, { level, message, jsonDump, scope }: CreateLogDTO): LogEntry {
		// TODO: validate level
		const now = DateTime.now();
		const timestamp = now.toFormat('MM/dd/yyyy, hh:mm:ss a');
		const timestampObj = now.toObject();

		const logs = this.data.getLogs(project);
		const newEntry = { level, message, jsonDump, scope, timestamp, timestampObj };

		this.data.setLogs(project, [...logs, newEntry]);
		this.fs.append(`${DATA_DIR}/${project}/${todayLogFile()}`, composeLogMessage(newEntry));

		this._cleanup(project);

		return newEntry;
	}

	private _cleanup(project: string): void {
		const { retention } = this.data.projects.find((proj) => proj.id === project)!;
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
			const logs = this.data.getLogs(project);

			const newLogs = logs.filter((entry) => {
				const logTime = DateTime.fromObject(entry.timestampObj);

				return !logTime.hasSame(purgedDay, 'day');
			});

			this.data.setLogs(project, newLogs);
			this.fs.rm(oldest);
		}
	}
}

