import { DateTime } from 'luxon';
import { LogEntry } from 'src/data/logs/models';

export const LOGFILE_DAY_FORMAT = 'y-M-dd';

export function fi<T>(): T {
	return undefined as T;
}

export function normalize(name: string): string {
	return name
		.split(/[-\s]/)
		.map((s) => s.toLowerCase())
		.join('-');
}

export function todayLogFile(): string {
	const now = DateTime.now();

	return `${now.toFormat(LOGFILE_DAY_FORMAT)}.log`;
}

export function composeLogMessage(entry: LogEntry): string {
	const dump = entry.jsonDump !== null ? `\nJSON Dump:\n${JSON.stringify(entry.jsonDump, null, 4)}` : '';
	const timestamp = DateTime.fromJSDate(entry.timestamp).toFormat('MM/dd/yyyy, hh:mm:ss a');

	if (entry.scope !== null) {
		return `${timestamp}:\n${entry.level.tag} [${entry.scope}] ${entry.message}${dump}\n\n`;
	} else {
		return `${timestamp}:\n${entry.level.tag} ${entry.message}${dump}\n\n`;
	}
}

