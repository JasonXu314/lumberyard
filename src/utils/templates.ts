import { LogLevel, Project } from 'src/data/data.models';
import { $each } from './html';

export function $formLogLevel(level: LogLevel): string {
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
