import { routes } from './routes';

export type Route = keyof typeof routes;

export type Page = typeof routes[Route];

export class Router {
  private currentRoute: Route;

  constructor() {
    this.currentRoute = '/overview';
  }

  route(newRoute: Route) {
    this.currentRoute = newRoute;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getCurrentPage() {
    return routes[this.currentRoute];
  }

  reset() {
    this.currentRoute = '/overview';
  }
}
