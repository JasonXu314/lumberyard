import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Redirect } from '@nestjs/common';
import { DEFAULT_LOG_LEVELS } from 'src/data/constants';
import { $each, INCLUDE_HTMX, page } from 'src/utils/html';
import { $formLogLevel } from 'src/utils/templates';
import { CreateProjectDTO } from './dtos';
import { ProjectsService } from './projects.service';

@Controller('/projects')
export class ProjectsController {
	constructor(private readonly service: ProjectsService) {}

	@Get('/')
	@Redirect('/', HttpStatus.PERMANENT_REDIRECT)
	public index(): void {}

	@Get('/new')
	public newProject(): string {
		return page('Lumberyard - New Project', INCLUDE_HTMX)`
			<h1>New Project</h1>
			<a href="/">Back</a>
			<form action="/projects/new" method="POST">
				<label>
					Name
					<input type="text" name="name"></input>
				</label>
				<label>
					Log Retention
					<input type="number" name="retention" value="5"></input>
				</label>
				${$each(DEFAULT_LOG_LEVELS)($formLogLevel)}
				<button hx-get="/projects/new-level" hx-target="this" hx-swap="beforebegin">Add new Level</button>
				<button type="submit" class="success">Create</button>
			</form>
		`;
	}

	@Post('/new')
	@Redirect('/', HttpStatus.SEE_OTHER)
	public newProjectAPI(@Body() body: CreateProjectDTO): void {
		this.service.makeProject(body);
	}

	@Get('/new-level')
	public newLevel(): string {
		return $formLogLevel({ tag: 'NEW', severity: 0, color: '#ffffff' });
	}

	@Get('/:id')
	public project(@Param('id') id: string): string {
		const project = this.service.getProject(id);

		if (!project) {
			throw new NotFoundException(`Project ${id} not found`);
		}

		return page(`Lumberyard - ${project.name} Config`)`
			<h1>${project.name}</h1>
			<a href="/">Back</a>
			<form action="/projects/update" method="POST">
				<label>
					Name
					<input type="text" name="name" value="${project.name}"></input>
				</label>
				<label>
					Log Retention
					<input type="number" name="retention" value="${project.retention}"></input>
				</label>
				${$each(project.logLevels)($formLogLevel)}
				
				<button type="submit" class="success">Create</button>
			</form>
		`;
	}
}

