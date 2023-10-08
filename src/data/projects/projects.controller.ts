import { Body, Controller, HttpStatus, Param, Post, Put, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateProjectDTO, UpdateProjectDTO } from './dtos';
import { Project } from './models';
import { ProjectsService } from './projects.service';

@Controller('/api/projects')
export class ProjectsController {
	constructor(private readonly service: ProjectsService) {}

	@Post('/')
	@Redirect('/', HttpStatus.SEE_OTHER)
	public async newProjectAPI(@Body() body: CreateProjectDTO): Promise<Project> {
		return this.service.makeProject(body);
	}

	@Put('/:id')
	public async editProject(@Param('id') id: string, @Body() data: UpdateProjectDTO, @Res({ passthrough: true }) res: Response): Promise<Project> {
		const project = await this.service.updateProject(id, data);

		res.setHeader('HX-Redirect', `/${id}`);

		return project;
	}
}

