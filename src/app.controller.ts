import { Controller, Get } from '@nestjs/common';
import { ProjectsService } from './projects/projects.service';
import { $table, page } from './utils/html';

@Controller()
export class AppController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get('/')
	public index(): string {
		return page('Lumberyard')`
			<h1>Lumberyard</h1>
			${$table(this.projectsService.getProjects())`<th scope="col">${['Name', 'Log Retention', '']}</th>`(
				(project) => `
				<tr>
					<td><a href="/projects/${project.id}/logs">${project.name}</a></td>
					<td>${project.retention}</td>
					<td><a href="/projects/${project.id}">config</a></td>
				</tr>
			`
			)}
			<a href="/projects/new" role="button">New Project</a>
		`;
	}
}

