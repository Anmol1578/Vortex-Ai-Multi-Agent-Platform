import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    parseReqBody: false,

    proxyReqPathResolver: (req) => {
      const path = req.originalUrl;

      if (path.startsWith("/api/agent")) {
        return path.replace(/^\/api\/agent/, "") || "/";
      }

      if (path.startsWith("/api/chat")) {
        return path.replace(/^\/api\/chat/, "") || "/";
      }

      if (path.startsWith("/api/billing")) {
        return path.replace(/^\/api\/billing/, "") || "/";
      }

      return req.url;
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (!srcReq.user?.userId) {
        const err = new Error("Missing authenticated user on proxied request");
        err.status = 401;
        throw err;
      }

      proxyReqOpts.headers["x-user-id"] = String(srcReq.user.userId);

      return proxyReqOpts;
    },
  });
};
