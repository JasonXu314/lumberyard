import { Controller, Get } from '@nestjs/common';
import { DEFAULT_LOG_LEVELS } from './data/constants';
import { ProjectsService } from './data/projects/projects.service';
import { $each, $table, INCLUDE_HTMX, page } from './utils/html';
import { $formLogLevel } from './utils/templates';

@Controller()
export class AppController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get('/')
	public async index(): Promise<string> {
		return page('Lumberyard')`
			<h1>Lumberyard</h1>
			${$table(await this.projectsService.getProjects())`<th scope="col">${['Name', 'Log Retention', '']}</th>`(
				(project) => `
				<tr>
					<td><a href="/${project.id}/logs">${project.name}</a></td>
					<td>${project.retention}</td>
					<td><a href="/${project.id}">config</a></td>
				</tr>
			`
			)}
			<a href="/new" role="button">New Project</a>
		`;
	}

	@Get('/new')
	public newProject(): string {
		return page('Lumberyard - New Project', INCLUDE_HTMX)`
			<h1>New Project</h1>
			<a href="/">Back</a>
			<form action="/api/projects" method="POST">
				<label>
					Name
					<input type="text" name="name"></input>
				</label>
				<label>
					Log Retention
					<input type="number" name="retention" value="5"></input>
				</label>
				${$each(DEFAULT_LOG_LEVELS)($formLogLevel)}
				<button hx-get="/new-level" hx-target="this" hx-swap="beforebegin">Add new Level</button>
				<button type="submit" class="success">Create</button>
			</form>
		`;
	}

	@Get('/new-level')
	public newLevel(): string {
		return $formLogLevel({ tag: 'NEW', severity: 0, color: '#ffffff' });
	}
}

