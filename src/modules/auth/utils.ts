import { cookies as getCookies } from "next/headers";

interface generateAuthCookieProps {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({
  prefix,
  value,
}: generateAuthCookieProps) => {
  const cookies = await getCookies();

  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
  });
};



// const cookies = await getCookies();

// cookies.set({
//   // optional cookie prefix
//   // name: `${ctx.payload.config.cookiePrefix}-token`,

//   name: AUTH_COOKIE,
//   value: data.token,
//   httpOnly: true,
//   path: "/",
//   // sameSite: "none",
//   // domain:''
// });