export function lookupComponent(application, componentName) {
  return application.__container__.lookup(`component:${componentName}`);
}

export function lookupRoute(application, routeName) {
  return application.__container__.lookup(`route:${routeName}`);
}
