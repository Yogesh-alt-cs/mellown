import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/healthz")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        return Response.redirect(`${url.origin}/api/health`, 307);
      },
    },
  },
  beforeLoad: () => {
    throw redirect({ to: "/api/health" as never });
  },
});
