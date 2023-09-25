import { DateTime } from 'luxon';
import { LogEntry } from 'src/data/data.models';

const DATETIME_PADDING = new Array(28).fill(' ').join('');
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
	const dump =
		entry.jsonDump !== undefined
			? `\n${DATETIME_PADDING}JSON Dump:\n${JSON.stringify(entry.jsonDump, null, 4)
					.split('\n')
					.map((str) => DATETIME_PADDING + str)
					.join('\n')}`
			: '';

	if (entry.scope !== undefined) {
		return `${entry.timestamp}:\t${entry.level} [${entry.scope}] ${entry.message}${dump}\n`;
	} else {
		return `${entry.timestamp}:\t${entry.level} ${entry.message}${dump}\n`;
	}
}

