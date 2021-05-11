package edu.uclm.esi.carreful.http;

import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class CookiesController {
	public static final String COOKIENAME = "laCookie";
	public static final String COOKIEPATH = "/";

	protected Cookie readOrCreateCookie(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		if (cookies==null)
			return createCookie(response);
		Cookie cookie = findCookie(cookies);
		if (cookie==null)
			cookie = createCookie(response);
		return cookie;
	}

	private Cookie findCookie(Cookie[] cookies) {
		for (Cookie cookie : cookies)
			if (cookie.getName().equals(COOKIENAME))
				return cookie;
		return null;
	}

	private Cookie createCookie(HttpServletResponse response) {
		Cookie cookie = new Cookie(COOKIENAME, UUID.randomUUID().toString());
		cookie.setPath(COOKIEPATH);
		cookie.setMaxAge(30*24*60*60);
		response.addCookie(cookie);
		return cookie;
	}
}
