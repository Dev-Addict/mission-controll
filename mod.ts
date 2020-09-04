import { Application } from "https://deno.land/x/oak@v6.1.0/mod.ts";

const app = new Application();

app.use(async ({ request: { method, url }, response }, next) => {
  await next();
  const time = response.headers.get("X-Response-Time");
  console.log(`${method} ${url}: ${time}`);
});

app.use(async ({ response }, next) => {
  const start = Date.now();
  await next();
  const time = Date.now() - start;
  response.headers.set("X-Response-Time", `${time}ms`);
});

app.use(({ response }) => {
  response.body = "hello world!";
});

const PORT = 3000;

if (import.meta.main) {
  await app.listen({
    port: PORT,
  });
}
