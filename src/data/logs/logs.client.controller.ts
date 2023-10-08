import { Controller, Get, NotFoundException, Param, Query, UseInterceptors } from '@nestjs/common';
import { DateTime } from 'luxon';
import { $each, $if, $table, page } from 'src/utils/html';
import { CheckboxInterceptor } from 'src/utils/interceptors/checkbox.interceptor';
import { $logLevelStyles } from 'src/utils/templates';
import { ProjectsService } from '../projects/projects.service';
import { FilterDTO } from './dtos';
import { LogsService } from './logs.service';

@Controller('/:id/logs')
export class LogsClientController {
	constructor(private readonly service: LogsService, private readonly projects: ProjectsService) {}

	@Get('/')
	@UseInterceptors(new CheckboxInterceptor('query', ['byMessage', 'byScope', 'byJSON']))
	public async index(@Param('id') id: string, @Query() { query = '', byMessage, byScope, byJSON, ...rest }: FilterDTO): Promise<string> {
		const project = await this.projects.getProject(id);

		if (!project) {
			throw new NotFoundException(`Project ${id} not found`);
		}

		const limitSet = byMessage || byScope || byJSON;
		if (!limitSet) {
			byMessage = true;
			byScope = true;
			byJSON = true;
		}

		const levelOptions = project.logLevels.map<'Show Matching' | 'Always Show' | 'Never Show'>((level) => {
			if (`include${level.tag}` in rest) {
				const val = rest[`include${level.tag}`];

				if (val === 'Show Matching' || val === 'Always Show' || val === 'Never Show') {
					return val;
				} else {
					return 'Show Matching';
				}
			} else {
				return 'Show Matching';
			}
		});

		return page(`Lumberyard - ${project.name} Logs`, $logLevelStyles(project))`
			<h1>${project.name}</h1>
			<a href="/">Back</a>
			<details open>
				<summary>Filter Logs</summary>
				<form action="/projects/${id}/logs" method="GET">
					<input type="search" placeholder="Query" name="query" value="${query}" />
					<fieldset>
						<legend>Search By</legend>
						<input id="by-message" type="checkbox" name="byMessage"${$if(!limitSet || byMessage)` checked`} />
						<label for="by-message">Message</label>
						<input id="by-scope" type="checkbox" name="byScope"${$if(!limitSet || byScope)` checked`} />
						<label for="by-scope">Scope</label>
						<input id="by-json" type="checkbox" name="byJSON"${$if(!limitSet || byJSON)` checked`} />
						<label for="by-json">JSON Dump</label>
					</fieldset>
					<fieldset>
						<legend>Included Levels</legend>
						${$each(project.logLevels)(
							(level, i) => `
						<label class="__LOG_LEVEL_${level.tag} row apart">
							${level.tag}
							<select name="include${level.tag}">
								${$each(['Show Matching', 'Always Show', 'Never Show'])(
									(option) => `
								<option${$if(option === levelOptions[i])` selected`}>${option}</option>
								`
								)}
							</select>
						</label>
						`
						)}
					</fieldset>
					<button type="submit">Search</button>
				</form>
			</details>
			${$table(
				await this.service.getLogs(id, {
					query,
					byMessage,
					byScope,
					byJSON,
					levelOptions: Object.fromEntries(levelOptions.map((option, i) => [project.logLevels[i].tag, option]))
				}),
				{ id: 'logs-table' }
			)`<th scope="col">${['Level', 'Timestamp', 'Scope', 'Message', 'JSON Dump']}</th>`(
				(entry) => `
				<tr>
					<td class="__LOG_LEVEL_${entry.level.tag}">${entry.level.tag}</td>
					<td>${DateTime.fromJSDate(entry.timestamp).toFormat('MM/dd/yyyy, hh:mm:ss a')}</td>
					<td>${entry.scope === null ? 'N/A' : entry.scope}</td>
					<td>${entry.message}</td>
					<td>
						${$if(entry.jsonDump !== null)`
						<details>
							<summary></summary>
							<pre>${JSON.stringify(entry.jsonDump, null, 4)}</pre>
						</details>
						`}
					</td>
				</tr>
			`
			)}
		`;
	}
}

