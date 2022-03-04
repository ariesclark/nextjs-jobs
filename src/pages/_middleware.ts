import { NextResponse } from "next/server";

import { getDateUrl } from "../lib/date";

import type { NextRequest } from "next/server";

export async function middleware (req: NextRequest) {
	if (["/", "/hiring"].includes(req.nextUrl.pathname)) {
		req.nextUrl.pathname = getDateUrl(new Date());
		return NextResponse.redirect(req.nextUrl, 303);
	}

	return NextResponse.next();
}
