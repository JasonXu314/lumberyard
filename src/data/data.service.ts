import { ConsoleLogger, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FSService } from 'src/fs/fs.service';
import { DATA_DIR } from './constants';

@Injectable()
export class DataService extends PrismaClient implements OnModuleInit {
	private readonly logger = new ConsoleLogger('Data Service');

	public constructor(private readonly fs: FSService) {
		super();
	}

	public async onModuleInit(): Promise<void> {
		await this.$connect();
		this.fs.ensureDir(DATA_DIR);
		this.logger.log('Connected & ensured data dir');
	}
}

