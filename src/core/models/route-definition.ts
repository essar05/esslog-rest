export interface RouteDefinition {
    path: string;
    requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put' | 'patch';
    methodName: string;
    requiresAuthentication?: boolean;
    requiredPermissions?: Array<String>;
}