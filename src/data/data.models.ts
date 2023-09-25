import { _ToObjectOutput } from 'luxon';

export interface Data {
	projects: Project[];
	logs: Record<string, LogEntry[]>;
}

export interface Project {
	name: string;
	id: string;
	logLevels: LogLevel[];
	retention: number;
}

export interface LogLevel {
	tag: string;
	severity: number;
	color: string;
}

export interface LogEntry {
	timestamp: string;
	scope?: string;
	level: string;
	message: string;
	jsonDump?: any;
	timestampObj: Partial<_ToObjectOutput<false>>;
}

