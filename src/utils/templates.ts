import { LogLevel } from '@prisma/client';
import { Project } from 'src/data/projects/models';
import { $each } from './html';

export function $formLogLevel(level: Omit<LogLevel, 'projectId'>): string {
	return `
	<div class="row">
		<label>
			Tag
			<input type="text" name="tag[]" value="${level.tag}"></input>
		</label>
		<label>
			Severity
			<input type="number" name="severity[]" value="${level.severity}"></input>
		</label>
		<label>
			Color
			<input type="color" name="color[]" value="${level.color}"></input>
		</label>
	</div>
	`;
}

export function $formLogLevelEditor(level: Omit<LogLevel, 'projectId'>): string {
	return `
	<div class="row">
		<label>
			Tag
			<input type="text" name="tag[]" value="${level.tag}"></input>
			<input type="hidden" name="originalTag[]" value="${level.tag}"></input>
		</label>
		<label>
			Severity
			<input type="number" name="severity[]" value="${level.severity}"></input>
		</label>
		<label>
			Color
			<input type="color" name="color[]" value="${level.color}"></input>
		</label>
		<button style="margin-top: auto; margin-bottom: auto;" class="error"><i class="fa-solid fa-trash"></i></button>
	</div>
	`;
}

export function $logLevelStyles(project: Project): string {
	return `
	<style>
	${$each(project.logLevels)(
		(level) => `
		.__LOG_LEVEL_${level.tag} {
			color: ${level.color};
		}
	`
	)}
	</style>
	`;
}

