package v1

import (
	"github.com/NikolaB131/logistics-management-system/internal/controller/http/v1/middlewares"
	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/gin-gonic/gin"
)

func NewRouter(r *gin.Engine, middlewares middlewares.Middlewares, authService service.AuthService) {
	v1 := r.Group("/v1")
	{
		newAuthRoutes(v1, authService)
	}
}
