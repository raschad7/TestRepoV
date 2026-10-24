/** Tiny method + path router. Path params use `:name`. */
export class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler) {
    const keys = [];
    const source = pattern.replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return "([^/]+)";
    });
    this.routes.push({ method, regex: new RegExp(`^${source}$`), keys, handler });
    return this;
  }

  match(method, pathname) {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const m = route.regex.exec(pathname);
      if (!m) continue;
      const params = Object.fromEntries(route.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      return { handler: route.handler, params };
    }
    return null;
  }
}
