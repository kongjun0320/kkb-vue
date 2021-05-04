import createRouteMap from './create-route-map'
import { createRoute } from './history/base'

export default function createMatcher(routes) {
  const { pathList, pathMap } = createRouteMap(routes)
  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap)
  }
  function match(location) {
    if (pathMap[location]) {
      return createRoute(pathMap[location], {
        path: location
      })
    }
    return createRoute(null, {
      path: location
    })
  }
  return {
    addRoutes,
    match
  }
}
