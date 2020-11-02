package routers

/* func CustomRouter(c echo.Context) error {
	if c.Param("projectId") != "" {

		// /projects/:projectId/services/*serviceI
		serviceId := strings.TrimLeft(c.Param("serviceId"), "/")
		if serviceId != "" && serviceId != "/" {
			return controllers.GetService(c)
		}

		// /projects/:projectId/services

		return controllers.GetServices(c)
	}
	return nil

}

func GetServices(c echo.Context) error {
	if c.Param("projectId") != "" {

		// /projects/:projectId/services/*serviceI
		serviceId := strings.TrimLeft(c.Param("serviceId"), "/")
		if serviceId != "" && serviceId != "/" {
			return controllers.GetService(c)
		}

		// /projects/:projectId/services

		return controllers.GetServices(c)
	}
	return nil

}
*/
