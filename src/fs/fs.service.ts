import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs';

@Injectable()
export class FSService {
	private readonly logger = new ConsoleLogger('FS Service');

	public exists(path: string): boolean {
		return existsSync(path);
	}

	public isDir(path: string): boolean {
		return statSync(path).isDirectory();
	}

	public ensureDir(path: string): void {
		if (this.exists(path)) {
			if (!this.isDir(path)) {
				throw new Error(`'${path}' is not a dir`);
			}
		} else {
			try {
				this.mkdir(path);
			} catch (err) {
				if (err instanceof Error) {
					this.logger.error(err.message);
				}
				throw new Error(`Unable to ensure dir '${path}'`);
			}
		}
	}

	public mkdir(path: string): void {
		mkdirSync(path);
	}

	public read(path: string): string {
		return this.readbuf(path).toString();
	}

	public readdir(path: string): string[] {
		if (this.exists(path)) {
			if (this.isDir(path)) {
				return readdirSync(path);
			} else {
				throw new Error(`'${path}' is not a dir`);
			}
		} else {
			throw new Error(`'${path}' does not exist`);
		}
	}

	public readbuf(path: string): Buffer {
		if (this.exists(path)) {
			if (this.isDir(path)) {
				throw new Error(`'${path}' is a dir`);
			} else {
				return readFileSync(path);
			}
		} else {
			throw new Error(`'${path}' does not exist`);
		}
	}

	public write(path: string, data: string | Buffer): void {
		writeFileSync(path, data);
	}

	public append(path: string, data: string | Buffer): void {
		appendFileSync(path, data);
	}

	public rm(path: string): void {
		rmSync(path, { recursive: true });
	}
}

