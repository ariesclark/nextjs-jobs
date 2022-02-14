import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkGithub from "remark-github";
import { remarkTruncateLinks } from "remark-truncate-links";
import ms from "ms";
import {
	GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage
} from "next";

import { getKeywordIcons } from "../../../lib/keywords";
import {
	ALL_VALID_DATES,
	formatDate, isValidDate, normalizeDate
} from "../../../lib/date";
import { getHiringPosts, HiringPost } from "../../../lib/query";

type RequestParams = { year?: string, month?: string };
type RequestProps = { posts: HiringPost[], when: RequestParams };

function getSocialImageURL (date: Date, posts: HiringPost[]): string {
	const text = `Job board for<br/>**${formatDate(date)}** 🚀<br/>`
        + `<p style="font-size:50px">${posts.length} jobs currently listed.</p>`;

	return `https://og-image.vercel.app/${encodeURIComponent(text)}.png?theme=dark&md=1&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg&widths=350&heights=200`;
}

export const getStaticPaths: GetStaticPaths<RequestParams> = function () {
	return {
		fallback: "blocking",
		paths: ALL_VALID_DATES.map((date) => {
			return {
				params: {
					year: date.getFullYear().toString(),
					month: date.getMonth().toString()
				}
			};
		})
	};
};

export const getStaticProps: GetStaticProps<RequestProps, RequestParams> = async function (context) {
	const date = (context.params?.year !== undefined && context.params?.month !== undefined
		? new Date(Number.parseInt(context.params?.year, 10), Number.parseInt(context.params?.month, 10))
		: new Date()
	);

	const posts = await getHiringPosts(date);

	return {
		revalidate: 60,
		props: {
			posts,
			when: {
				year: date.getFullYear().toString(),
				month: date.getMonth().toString()
			}
		}
	};
};

const HiringIndexPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = function ({ posts, when }) {
	const date = new Date(Number.parseInt(when.year!, 10), Number.parseInt(when.month!, 10));
	const latestDate = normalizeDate(new Date());

	const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1);
	const isLastMonthValid = isValidDate(lastMonth);

	const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
	const isNextMonthValid = isValidDate(nextMonth);

	return (
		<div className="flex flex-col justify-between min-h-screen bg-neutral-900 text-neutral-200">
			<Head>
				<title>{formatDate(date)} - Next.js job board</title>
				<link rel="icon" href="/favicon.ico" />

				<meta property="og:title" content={formatDate(date)} />
				<meta property="og:image" content={getSocialImageURL(date, posts)} />

				<meta property="og:type" content="website" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:site_name" content="Next.js job board" />
			</Head>
			<div className="container flex flex-col p-4 mx-auto mb-8 space-y-8 lg:px-32">
				<div className="flex flex-col mx-auto mt-8">
					<h1 className="flex flex-col text-2xl font-inter font-extralight">
						<svg height="124" viewBox="0 0 207 125" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M91.188 32.975h4.14L113.67 58.44l18.749-25.464L157.922.63l-41.897 60.485 21.589 29.762h-4.301l-19.642-27.086-19.723 27.086h-4.22l21.751-29.762-20.29-28.14zm-42.449 0H87.7v3.082H52.31V59.25h33.278v3.082H52.311v25.464h35.793v3.081H48.74V32.975zm90.418 0v3.082h20.372v54.82h3.571v-54.82h20.454v-3.082h-44.397z" fill="currentColor" />
							<path d="M0 32.975h4.464l61.557 91.671-25.439-33.769L3.734 37.354 3.57 90.877H0V32.975z" fill="currentColor" />
							<path fillRule="evenodd" clipRule="evenodd" d="M201.73 87.022c-2.78 0-4.647-1.429-4.786-3.662h1.928c.165 1.186 1.329 1.94 3.005 1.94 1.564 0 2.71-.806 2.71-1.914 0-.952-.729-1.523-2.388-1.913l-1.616-.39c-2.267-.527-3.301-1.618-3.301-3.453 0-2.224 1.825-3.704 4.561-3.704 2.545 0 4.404 1.48 4.516 3.583h-1.893c-.183-1.151-1.19-1.87-2.649-1.87-1.538 0-2.563.736-2.563 1.861 0 .892.66 1.403 2.293 1.784l1.381.337c2.572.597 3.631 1.636 3.631 3.514 0 2.39-1.859 3.887-4.829 3.887zm-15.027-3.55c0 2.147 1.555 3.55 3.822 3.55 2.414 0 3.874-1.446 3.874-3.956v-8.837h-1.946v8.828c0 1.394-.704 2.138-1.946 2.138-1.111 0-1.867-.692-1.893-1.722h-1.911zm-3.509 3.394c.738 0 1.277-.563 1.277-1.29 0-.727-.539-1.29-1.277-1.29-.73 0-1.277.563-1.277 1.29 0 .727.547 1.29 1.277 1.29z" fill="currentColor" />
						</svg>
						<span className="my-auto w-fit" style={{ transform: "translateY(-1.75rem) translateX(7rem)" }}>
							Job board
						</span>
					</h1>
					<div className="flex flex-col space-y-2">
						<div className="flex mx-auto space-x-4">
							<Link href={`/hiring/${lastMonth.getFullYear()}/${lastMonth.getMonth()}`}>
								<a className={`flex px-2 py-1 ${!isLastMonthValid ? "text-neutral-500 cursor-not-allowed" : ""}`}>
									<svg className="h-2.5 my-auto" viewBox="0 0 768 896" xmlns="http://www.w3.org/2000/svg">
										<path fill="currentColor" d="M768 896L0 448 768 0v896z" />
									</svg>
								</a>
							</Link>
							<h2 className="w-48 font-mono text-lg select-none">{formatDate(date)}</h2>
							<Link href={`/hiring/${nextMonth.getFullYear()}/${nextMonth.getMonth()}`}>
								<a className={`flex px-2 py-1 ${!isNextMonthValid ? "text-neutral-500 cursor-not-allowed" : ""}`}>
									<svg className="h-2.5 my-auto" viewBox="0 0 768 896" xmlns="http://www.w3.org/2000/svg">
										<path fill="currentColor" d="M0 0l768 448L0 896V0z" />
									</svg>
								</a>
							</Link>
						</div>
						{date.getTime() !== latestDate.getTime() && (
							<div className="flex flex-col mx-auto text-xs">
								<div className="flex space-x-1">
									<span>Currently viewing postings that are</span>
									<b>{ms(latestDate.getTime() - date.getTime(), { long: true })} old</b>.
								</div>
								<div className="flex space-x-1">
									<span>Would you like to view the</span>
									<Link href={`/hiring/${latestDate.getFullYear()}/${latestDate.getMonth()}`}>
										<a className="underline">
											latest postings
										</a>
									</Link>?
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-wrap">
					{posts.map((post) => (
						<div key={post.sourceUrl} className="w-full md:w-1/2 lg:w-1/3">
							<div className="flex flex-col m-2 space-y-4 border bg-neutral-800 border-neutral-700">
								<div className="flex flex-col p-4 space-y-2 border-b border-neutral-700">
									<span className="text-xl font-inter">
										{post.companyName}
									</span>
									<div className="flex flex-wrap gap-1">
										{post.keywords.map((value: string) => (
											<div key={value} className="flex p-1 px-2 space-x-2 rounded bg-neutral-900">
												<span className="my-auto text-xs text-neutral-300">
													{value}
												</span>
												{getKeywordIcons(value).length ? (
													<div className="flex space-x-1">
														{getKeywordIcons(value).map((item) => (
															<span key={item}>{item}</span>
														))}
													</div>
												) : false}
											</div>
										))}
									</div>
								</div>
								<div className="">
									<ReactMarkdown
										remarkPlugins={[
											remarkGfm,
											[remarkGithub, { repository: "vercel/next.js" }],
											remarkGemoji,
											remarkTruncateLinks
										]}
										className="px-4 prose prose-invert max-h-96 overflow-y-clip"
									>
										{(post.bodyText as string).replace(/link above/gi, "link below")}
									</ReactMarkdown>
									<Link href={post.sourceUrl}>
										<a target="_blank" className="flex px-4 py-1 space-x-1 text-xs text-neutral-300">
											<span className="">Read more</span>
											{/* eslint-disable-next-line max-len */}
											<svg className="h-1.5 my-auto" viewBox="0 0 768 512" xmlns="http://www.w3.org/2000/svg">
												<path fill="currentColor" d="M0 0l384 512L768 0H0z" />
											</svg>
										</a>
									</Link>
								</div>

								<Link href={post.contactUrl}>
									<a target="_blank" className="flex w-full p-4 bg-blue-600 border-t border-neutral-700">
										<span className="mx-auto text-center">Reach out</span>
									</a>
								</Link>
							</div>
						</div>
					))}

				</div>
			</div>
			<div className="border-t border-neutral-700">
				<div className="container flex flex-col justify-between px-4 py-8 mx-auto space-y-4 lg:px-32 lg:flex-row lg:space-y-0 lg:space-x-8">
					<div className="flex flex-wrap gap-4 text-sm text-neutral-300">
						<div className="flex flex-wrap w-full gap-4 text-sm text-neutral-300">
							<Link href="https://github.com/">
								<a target="_blank">
									<div className="flex space-x-2">
										<svg className="h-6 my-auto" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
										</svg>
										<span className="my-auto">View source on GitHub</span>
									</div>
								</a>
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 text-sm text-neutral-300">
							<Link href="https://nextjs.org/">
								<a target="_blank">
									<div className="flex space-x-2">
										<svg className="h-6 my-auto" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="currentColor" d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z" />
										</svg>
										<span className="my-auto">Next.js</span>
									</div>
								</a>
							</Link>
							<Link href="https://vercel.com/">
								<a target="_blank">
									<div className="flex space-x-2">
										<svg className="h-6 my-auto" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="currentColor" d="M24 22.525H0l12-21.05 12 21.05z" />
										</svg>
										<span className="my-auto">Vercel</span>
									</div>
								</a>
							</Link>
							<Link href="https://tailwindcss.com/">
								<a target="_blank">
									<div className="flex space-x-2">
										<svg className="h-6 my-auto" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="currentColor" d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
										</svg>
										<span className="my-auto">Tailwind CSS</span>
									</div>
								</a>
							</Link>
						</div>
					</div>
					<span className="max-w-md text-xs text-neutral-400">
						This site is maintained and created by an independent individual with no affiliation with
						{" "}
						<Link href="https://vercel.com/"><a target="_blank" className="underline">Vercel</a></Link>
						{" "}
						or any of their subsidiaries and partners.
					</span>
				</div>
			</div>
		</div>
	);
};

export default HiringIndexPage;
