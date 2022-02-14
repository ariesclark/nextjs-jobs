export const keywordIconMap: {
    regex: RegExp,
    icons: string[]
}[] = [
	{
		regex: /remote/i,
		icons: ["🏠"]
	},
	{
		regex: /full[- ]?stack/i,
		icons: ["🧰"]
	},
	{
		regex: /front[- ]?end|designer/i,
		icons: ["🎨"]
	},
	{
		regex: /senior/i,
		icons: ["🧱"]
	},
	{
		regex: /full[- ]?time/i,
		icons: ["⏲️"]
	},
	{
		regex: /contract/i,
		icons: ["📃"]
	},
	{
		regex: /\$/i,
		icons: ["💸"]
	},
	{
		regex: /equity|stock/i,
		icons: ["📈"]
	}
];

export function getKeywordIcons (value: string) {
	const icons: string[] = [];

	keywordIconMap.forEach((item) => {
		if (value.match(item.regex)) {
			icons.push(...item.icons);
		}
	});

	return icons;
}
