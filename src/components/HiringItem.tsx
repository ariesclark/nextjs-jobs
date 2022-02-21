import ReactMarkdown from "react-markdown";
import { remarkTruncateLinks } from "remark-truncate-links";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkGithub from "remark-github";
import Link from "next/link";
import ms from "ms";

import { getKeywordIcons } from "../lib/keywords";
import { type HiringPost } from "../lib/query";

export const HiringItem: React.FC<{ post: HiringPost }> = function ({ post }) {
	const presentDate = new Date();

	const publishDate = new Date(post.publishedAt);
	const updateDate = new Date(post.updatedAt);

	return (
		<div className="w-full md:w-1/2 lg:w-1/3">
			<div className="flex flex-col m-2 border rounded bg-neutral-800 border-neutral-700">
				<div className="flex flex-col p-4 space-y-2 border-b border-neutral-700">
					<span className="text-xl font-inter">
						{post.companyName}
					</span>
					<div className="flex flex-wrap gap-1">
						{post.keywords.map((value: string) => (
							<div key={value} className="flex justify-between flex-grow p-1 px-2 space-x-2 rounded bg-neutral-900">
								<span className="my-auto text-xs tracking-wide text-neutral-300">
									{value}
								</span>
								{getKeywordIcons(value).length ? (
									<div className="flex space-x-1 leading-5">
										{getKeywordIcons(value).map((item) => (
											<div key={item} className="w-5">
												<span className="mx-auto">{item}</span>
											</div>
										))}
									</div>
								) : false}
							</div>
						))}
					</div>
					<div className="flex space-x-4 text-xs text-neutral-300">
						<div className="flex space-x-2">
							<svg className="w-3 my-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
								<path fill="currentColor" d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" />
								<polygon fill="currentColor" points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22" />
							</svg>
							<span>Published {ms(presentDate.getTime() - publishDate.getTime(), { long: true })} ago</span>
						</div>
						<div className="flex space-x-2">
							<svg className="w-3 my-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
								<path fill="currentColor" d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" />
								<polygon fill="currentColor" points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22" />
							</svg>
							<span>Updated {ms(presentDate.getTime() - updateDate.getTime(), { long: true })} ago</span>
						</div>
					</div>
				</div>
				<div className="pt-4">
					<ReactMarkdown
						remarkPlugins={[
							remarkGfm,
							[remarkGithub, { repository: "vercel/next.js" }],
							remarkGemoji,
							remarkTruncateLinks
						]}
						className="px-4 prose prose-invert max-h-96 overflow-y-clip "
					>
						{(post.bodyText as string).replace(/link above/gi, "link below")}
					</ReactMarkdown>
					<Link href={post.sourceUrl}>
						<a target="_blank" className="flex px-4 py-1 my-4 space-x-1 text-xs text-neutral-300">
							<span className="">Read more</span>
							<svg className="h-1.5 my-auto" viewBox="0 0 768 512" xmlns="http://www.w3.org/2000/svg">
								<path fill="currentColor" d="M0 0l384 512L768 0H0z" />
							</svg>
						</a>
					</Link>
				</div>

				<Link href={post.contactUrl}>
					<a target="_blank" className="flex w-full p-4 bg-blue-600 border-t rounded-b hover:bg-blue-700 border-neutral-700">
						<span className="mx-auto text-center">Reach out</span>
					</a>
				</Link>
			</div>
		</div>
	);
};
