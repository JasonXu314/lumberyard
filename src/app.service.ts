import { Injectable } from '@nestjs/common';
import { Project } from './data/data.models';
import { DataService } from './data/data.service';

@Injectable()
export class AppService {
	public constructor(private readonly data: DataService) {}

	public getProjects(): Project[] {
		return this.data.projects;
	}
}

