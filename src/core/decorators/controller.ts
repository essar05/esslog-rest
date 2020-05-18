import 'reflect-metadata';

export const Controller = (path: string = ''): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata('path', path, target);

        if (! Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
    };
};