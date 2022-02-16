import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware (req: NextRequest) {
	const { pathname } = req.nextUrl;
	const date = new Date();
	const url = req.nextUrl.clone();
	url.pathname = `/hiring/${date.getFullYear()}/${date.getMonth()}`;

	if (pathname === "/") {
		return NextResponse.redirect(url, 303);
	}
	if (pathname === "/hiring") {
		return NextResponse.redirect(url, 303);
	}
	return NextResponse.next();
}
