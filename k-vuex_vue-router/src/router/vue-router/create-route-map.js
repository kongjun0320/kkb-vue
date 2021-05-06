export default function createRouteMap(routes, oldPathlist, oldPathMap) {
  const pathList = oldPathlist || []
  const pathMap = oldPathMap || []

  routes.forEach((route) => {
    addRouteRecord(route, pathList, pathMap)
  })

  return {
    pathList,
    pathMap
  }
}

function addRouteRecord(route, pathList, pathMap, parent) {
  const path = parent ? parent.path + '/' + route.path : route.path
  const record = {
    path,
    component: route.component,
    parent
  }
  if (!pathMap[path]) {
    pathList.push(path)
    pathMap[path] = record
  }

  if (route.children) {
    route.children.forEach((childRoute) => {
      addRouteRecord(childRoute, pathList, pathMap, record)
    })
  }
}
