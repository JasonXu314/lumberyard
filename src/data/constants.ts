import { LogLevel } from '@prisma/client';

export const DATA_DIR = process.env.DATA_DIR!;

export const DEFAULT_LOG_LEVELS: Omit<LogLevel, 'projectId'>[] = [
	{ tag: 'LOG', severity: 0, color: '#0172ad' },
	{ tag: 'WARN', severity: 1, color: '#e8ae01' },
	{ tag: 'ERR', severity: 2, color: '#d93526' }
];

