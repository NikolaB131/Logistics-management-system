package v1

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/NikolaB131/logistics-management-system/pkg/sl"
	"github.com/gin-gonic/gin"
)

type (
	CouriersService interface {
		GetCouriers(ctx context.Context) ([]entity.Courier, error)
		Create(ctx context.Context, name string, phoneNumber *string, carNumber *string, notes *string) (uint64, error)
		Update(ctx context.Context, id uint64, name *string, phoneNumber *string, carNumber *string, status *string, notes *string) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	couriersRoutes struct {
		couriersService CouriersService
	}

	courierCreateBody struct {
		Name        string  `json:"name" binding:"required"`
		PhoneNumber *string `json:"phone_number"`
		CarNumber   *string `json:"car_number"`
		Notes       *string `json:"notes"`
	}

	courierUpdateBody struct {
		Name        *string `json:"name"`
		PhoneNumber *string `json:"phone_number"`
		CarNumber   *string `json:"car_number"`
		Status      *string `json:"status"`
		Notes       *string `json:"notes"`
	}
)

func newCouriersRoutes(g *gin.RouterGroup, couriersService CouriersService) {
	couriersR := couriersRoutes{couriersService: couriersService}

	couriers := g.Group("/courier")
	{
		couriers.GET("/", couriersR.getCouriers)
		couriers.POST("/", couriersR.createCourier)
		couriers.PATCH("/:id", couriersR.updateCourier)
		couriers.DELETE("/:id", couriersR.deleteCourier)
	}
}

func (r *couriersRoutes) getCouriers(c *gin.Context) {
	couriers, err := r.couriersService.GetCouriers(c)
	if err != nil {
		slog.Error("failed to get couriers", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed get couriers"})
		return
	}

	if len(couriers) == 0 {
		couriers = []entity.Courier{}
	}

	c.JSON(http.StatusOK, couriers)
}

func (r *couriersRoutes) createCourier(c *gin.Context) {
	var body courierCreateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	id, err := r.couriersService.Create(c, body.Name, body.PhoneNumber, body.CarNumber, body.Notes)
	if err != nil {
		slog.Error("failed to create courier", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed create courier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}

func (r *couriersRoutes) updateCourier(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	var body courierUpdateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	if body.Status != nil && !(*body.Status == entity.CourierStatusBusy || *body.Status == entity.CourierStatusFree) {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("courier status cant be equal to: %s", *body.Status)})
		return
	}

	err = r.couriersService.Update(c, id, body.Name, body.PhoneNumber, body.CarNumber, body.Status, body.Notes)
	if err != nil {
		if errors.Is(err, service.ErrCourierNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "courier with such ID does not exist"})
		} else {
			slog.Error("failed to update courier", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed update courier"})
		}
		return
	}

	c.Status(http.StatusOK)
}

func (r *couriersRoutes) deleteCourier(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	err = r.couriersService.DeleteByID(c, id)
	if err != nil {
		if errors.Is(err, service.ErrCourierNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "courier with such ID does not exist"})
		} else {
			slog.Error("failed to delete courier", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed delete courier"})
		}
		return
	}

	c.Status(http.StatusOK)
}
