import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export const withLogLevels: Prisma.ProjectDefaultArgs & { include: Prisma.ProjectInclude<DefaultArgs> } = Prisma.validator<Prisma.ProjectDefaultArgs>()({
	include: { logLevels: { orderBy: { severity: 'asc' } } }
});

export type Project = Prisma.ProjectGetPayload<typeof withLogLevels>;

