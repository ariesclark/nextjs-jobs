export function normalizeDate (date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth());
}

// November 2020, the first release of the hiring discussions.
export const FIRST_POSSIBLE_DATE = new Date(2021, 10, 1);

export function isAboveInitialDate (date: Date): boolean {
	return date.getTime() >= FIRST_POSSIBLE_DATE.getTime();
}

export function isFutureDate (date: Date): boolean {
	return date.getTime() > Date.now();
}

export function isValidDate (date: Date): boolean {
	return isAboveInitialDate(date) && !isFutureDate(date);
}

export const ALL_VALID_DATES: Date[] = [];
for (
	let month = FIRST_POSSIBLE_DATE.getMonth();
	isValidDate(new Date(FIRST_POSSIBLE_DATE.getFullYear(), month));
	month += 1
) {
	const date = new Date(FIRST_POSSIBLE_DATE.getFullYear(), month);
	ALL_VALID_DATES.push(date);
}

export function formatDate (date: Date, internal: boolean = false): string {
	return new Intl.DateTimeFormat("en", {
		month: internal ? "short" : "long",
		year: "numeric"
	}).format(date);
}

export function getDateUrl (date: Date) {
	return `/hiring/${date.getFullYear()}/${new Intl.DateTimeFormat("en", { month: "long" }).format(date).toLowerCase()}`;
}
