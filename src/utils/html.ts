export type Tagger<T = string, E extends unknown[] = any[]> = (strings: TemplateStringsArray, ...expressions: E) => T;

export const INCLUDE_HTMX =
	'<script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>';

export function join(strings: TemplateStringsArray, expressions: any[]) {
	return strings
		.slice(1)
		.reduce((str, part, i) => str + (typeof expressions[i] === 'string' ? expressions[i] : JSON.stringify(expressions[i])) + part, strings[0]);
}

export function defaultJoiner(strings: TemplateStringsArray, ...expressions: any[]) {
	return join(strings, expressions);
}

export function page(title: string, ...head: string[]): Tagger {
	return (strings: TemplateStringsArray, ...expressions: any[]) => `
	<html data-theme="dark">
		<head>
			<title>${title}</title>
			<link rel="stylesheet" href="https://mypico.jasonxu.dev/min"></link>
			${head.join('\n')}
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<style>
			table tbody tr {
				display: table-row;
			}
			
			table form {
				margin-block-end: 0;
			}
			
			table button.table-btn {
				margin-bottom: 0;
			}

			table details summary {
				float: left;
			}

			.row.apart {
				justify-content: space-between;
				align-items: center;
			}

			.row.apart * {
				width: fit-content;
			}
			</style>
		</head>
		<body class="container">
			${join(strings, expressions)}
		</body>
	</html>
	`;
}

export function $if(condition: boolean): Tagger {
	return condition ? defaultJoiner : () => '';
}

export function $ifel(condition: boolean): Tagger<Tagger> {
	return condition
		? (strings: TemplateStringsArray, ...expressions: any[]) =>
				() =>
					join(strings, expressions)
		: () => defaultJoiner;
}

export function $each<T>(arr: T[]): (fn: (item: T, i: number) => string) => string {
	return (fn) => arr.map(fn).join('');
}

export function $table<T>(items: T[], { id }: { id?: string } = {}): Tagger<(fn: (item: T) => string) => string, [string[]]> {
	return (strings, labels) => (fn) =>
		`
	<table${$if(id !== undefined)` id="${id}"`}>
		<thead>
			<tr>
				${$each(labels)((label) => defaultJoiner(strings, label))}
			</tr>
		</thead>
		<tbody>
			${$each(items)(fn)}
		</tbody>
	</table>
	`;
}

