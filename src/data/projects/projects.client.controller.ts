import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { $each, INCLUDE_HTMX, page } from 'src/utils/html';
import { $formLogLevelEditor } from 'src/utils/templates';
import { ProjectsService } from './projects.service';

@Controller('/:id')
export class ProjectsClientController {
	constructor(private readonly service: ProjectsService) {}

	@Get('/')
	public async project(@Param('id') id: string): Promise<string> {
		const project = await this.service.getProject(id);

		if (!project) {
			throw new NotFoundException(`Project ${id} not found`);
		}

		return page(`Lumberyard - ${project.name}`)`
			<h1>${project.name}</h1>
			<a href="/">Back</a>
			<p><strong>Log Retention:</strong> ${project.retention} days</p>
			<h2>Log Levels:</h2>
			<ul>
				${$each(project.logLevels)(
					(level) => `
					<li>
						<p><strong style="color: ${level.color};">${level.tag}</strong>: ${level.severity} severity</p>
					</li>
				`
				)}
			</ul>
			<a href="/${id}/edit" role="button">Edit Config</a>
		`;
	}

	@Get('/edit')
	public async editProject(@Param('id') id: string): Promise<string> {
		const project = await this.service.getProject(id);

		if (!project) {
			throw new NotFoundException(`Project ${id} not found`);
		}

		return page(`Lumberyard - ${project.name} Config`, INCLUDE_HTMX)`
			<h1>${project.name}</h1>
			<a href="/${id}">Back</a>
			<form hx-put="/api/projects/${id}">
				<label>
					Name
					<input type="text" name="name" value="${project.name}"></input>
				</label>
				<label>
					Log Retention
					<input type="number" name="retention" value="${project.retention}"></input>
				</label>
				${$each(project.logLevels)($formLogLevelEditor)}
				<button hx-get="/new-level" hx-target="this" hx-swap="beforebegin">Add new Level</button>
				<button type="submit" class="success">Save</button>
			</form>
		`;
	}
}

