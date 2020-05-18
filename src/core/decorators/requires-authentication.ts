import { RouteDefinition } from "../models/route-definition";

export const RequiresAuthentication = (): MethodDecorator => {
    return (target, propertyKey: string): void => {
        if (! Reflect.hasMetadata('routes', target.constructor)) {
            return;
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        const currentRoute: RouteDefinition = routes.find(routeDefinition => routeDefinition.methodName === propertyKey);

        if (!currentRoute) {
            console.error("Cannot require authentication on method that hasn't been route decorated");
        }

        currentRoute.requiresAuthentication = true;

        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};