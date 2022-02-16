import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware (req: NextRequest) {
	if (["/", "/hiring"].includes(pathname) {
		const date = new Date();
	
		req.nextUrl.pathname = `/hiring/${date.getFullYear()}/${date.getMonth()}`;
		return NextResponse.redirect(req.nextUrl, 303);
	}

	return NextResponse.next();
}
