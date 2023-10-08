import { Prisma } from '@prisma/client';

export const defaultSelect = Prisma.validator<Prisma.LogEntryDefaultArgs>()({
	select: {
		message: true,
		scope: true,
		jsonDump: true,
		timestamp: true,
		level: {
			select: {
				tag: true,
				severity: true,
				color: true
			}
		}
	}
});

export type LogEntry = Prisma.LogEntryGetPayload<typeof defaultSelect>;

