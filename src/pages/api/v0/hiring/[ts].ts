import { getHiringPosts } from "../../../../lib/query";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
	const posts = await getHiringPosts(new Date(Number.parseInt(req.query.ts as string, 10) || Date.now()));
	if (posts.length === 0) return res.status(404).json([]);

	return res.status(200)
		.setHeader("Cache-Control", "public, max-age=31536000, immutable")
		.json(posts);
}
