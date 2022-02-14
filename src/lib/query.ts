import { graphql } from "@octokit/graphql";
import { Discussion, DiscussionComment } from "@octokit/graphql-schema";
import { HTMLElement, parse } from "node-html-parser";

import { formatDate, isValidDate } from "./date";

export enum DiscussionType {
    LOOKING_FOR_WORK = "Who wants to be hired?",
    HIRING = "Who's hiring?"
}

const client = graphql.defaults({
	headers: {
		authorization: `token ${process.env.GITHUB_TOKEN}`,
	},
});

export async function getDiscussions (type: DiscussionType, date: Date, count: number = 1): Promise<Discussion[]> {
	const query = `(${type} ${formatDate(date, true)})`;

	return (await client(`query {
        search (type: DISCUSSION, query: "repo:vercel/next.js \\"${query}\\"", first: ${count}) {
            nodes {
                ... on Discussion {
                    title,
                    comments (first: 50) {
                        nodes {
                            publishedAt,
                            updatedAt,
                            url,
                            body,
                            bodyText,
                            bodyHTML,
                            isMinimized
                        }
                    }
                }
            }
        }
    }`) as any).search.nodes;
}

export function a () {

}

function getLinks (dom: HTMLElement): { name?: string, href?: string }[] {
	return dom.querySelectorAll("a").map((element) => {
		return {
			name: element.innerText.trim(),
			href: element.getAttribute("href")
		};
	});
}

export interface HiringPost {
    companyName: string,
    keywords: string[],
    bodyText: string,

    publishedAt: string,
    updatedAt: string,

    contactUrl: string,
    sourceUrl: string
}

export async function getHiringPosts (date: Date): Promise<HiringPost[]> {
	if (!isValidDate(date)) return [];

	const latestDiscussion = (await getDiscussions(DiscussionType.HIRING, date, 1))[0];
	if (!latestDiscussion || !latestDiscussion.comments.nodes) return [];

	const comments = latestDiscussion.comments.nodes.filter((comment) => {
		return comment && !comment.isMinimized;
	}) as DiscussionComment[];

	return comments.map<HiringPost>((comment) => {
		const headerText = comment.bodyText.split("\n")[0];
		const headerValues = headerText.split("|").map((v: string) => v.trim());
		const headerLinks = getLinks(parse(comment.bodyHTML.split("\n")[0]));

		const companyName: string = headerValues.shift()!;
		const contactUrl: string = headerLinks[headerLinks.length - 1]?.href || comment.url;

		const bodyText = comment.body.split("\n").splice(1).join("\n").trim();

		return {
			companyName,
			keywords: headerValues.splice(0, headerValues.length - 1),

			bodyText,
			publishedAt: comment.publishedAt,
			updatedAt: comment.updatedAt,
			contactUrl,
			sourceUrl: comment.url
		};
	}).reverse();
}
