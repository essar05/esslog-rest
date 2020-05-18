import { RouteDefinition } from "./models/route-definition";
import { Express, NextFunction, Request, Response } from "express";
import BaseController from "./base-controller";

export const registerControllers = (app: Express, controllers: typeof BaseController[]) => {

    controllers.forEach((controller: typeof BaseController) => {
        const controllerInstance = new controller();
        const controllerPath = Reflect.getMetadata('path', controller);
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

        routes.forEach(route => {
            app[route.requestMethod](controllerPath + route.path, (req: Request, res: Response, next: NextFunction) => {
                // Execute our method for this path and pass our express request and response object.
                // @ts-ignore
                controllerInstance[route.methodName](req, res, next);
            });
        });
    });
};