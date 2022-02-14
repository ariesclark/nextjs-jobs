import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware (request: NextRequest) {
	const date = new Date();
	const url = request.nextUrl.clone();
	url.pathname = `/hiring/${date.getFullYear()}/${date.getMonth()}`;

	return NextResponse.redirect(url, 303);
}
