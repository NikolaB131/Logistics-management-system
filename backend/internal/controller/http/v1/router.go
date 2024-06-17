package v1

import (
	"github.com/NikolaB131/logistics-management-system/internal/controller/http/v1/middlewares"
	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/gin-gonic/gin"
)

func NewRouter(
	r *gin.Engine,
	middlewares middlewares.Middlewares,
	authService service.AuthService,
	clientsService ClientsService,
	couriersService CouriersService,
	warehouseService WarehouseService,
	ordersService OrdersService,
) {
	v1 := r.Group("/v1")
	{
		newAuthRoutes(v1, authService)
		newClientsRoutes(v1, clientsService)
		newCouriersRoutes(v1, couriersService)
		newWarehouseRoutes(v1, warehouseService)
		newOrdersRoutes(v1, ordersService)
	}
}
