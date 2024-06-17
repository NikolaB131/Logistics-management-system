package v1

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/NikolaB131/logistics-management-system/pkg/sl"
	"github.com/gin-gonic/gin"
)

type (
	OrdersService interface {
		GetOrders(ctx context.Context) ([]entity.Order, error)
		Create(ctx context.Context,
			courierID uint64,
			clientID uint64,
			addressFrom string,
			addressTo string,
			notes *string,
			deliverTo time.Time,
			items []entity.OrderItem,
			deliveryCost float32,
		) (uint64, error)
		Update(ctx context.Context,
			id uint64,
			courierID *uint64,
			clientID *uint64,
			addressFrom *string,
			addressTo *string,
			notes *string,
			status *string,
			deliverTo *time.Time,
			deliveredAt *time.Time,
			items *[]entity.OrderItem,
			deliveryCost *float32,
			totalCost *float32,
		) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	ordersRoutes struct {
		ordersService OrdersService
	}

	orderCreateBody struct {
		CourierID    uint64             `json:"courier_id" binding:"required"`
		ClientID     uint64             `json:"client_id" binding:"required"`
		AddressFrom  string             `json:"address_from" binding:"required"`
		AddressTo    string             `json:"address_to" binding:"required"`
		Notes        *string            `json:"notes"`
		DeliverTo    time.Time          `json:"deliver_to" binding:"required"`
		Items        []entity.OrderItem `json:"items" binding:"required"`
		DeliveryCost float32            `json:"delivery_cost" binding:"required"`
	}

	orderUpdateBody struct {
		CourierID    *uint64             `json:"courier_id"`
		ClientID     *uint64             `json:"client_id"`
		AddressFrom  *string             `json:"address_from"`
		AddressTo    *string             `json:"address_to"`
		Notes        *string             `json:"notes"`
		Status       *string             `json:"status"`
		DeliverTo    *time.Time          `json:"deliver_to"`
		DeliveredAt  *time.Time          `json:"delivered_at"`
		Items        *[]entity.OrderItem `json:"items"`
		DeliveryCost *float32            `json:"delivery_cost"`
		TotalCost    *float32            `json:"total_cost"`
	}
)

func newOrdersRoutes(g *gin.RouterGroup, ordersService OrdersService) {
	ordersR := ordersRoutes{ordersService: ordersService}

	orders := g.Group("/order")
	{
		orders.GET("", ordersR.getOrders)
		orders.POST("", ordersR.createOrder)
		orders.PATCH(":id", ordersR.updateOrder)
		orders.PATCH("finish/:id", ordersR.finishOrder)
		orders.DELETE(":id", ordersR.deleteOrder)
	}
}

func (r *ordersRoutes) getOrders(c *gin.Context) {
	orders, err := r.ordersService.GetOrders(c)
	if err != nil {
		slog.Error("failed to get orders", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed get orders"})
		return
	}

	if len(orders) == 0 {
		orders = []entity.Order{}
	}

	c.JSON(http.StatusOK, orders)
}

func (r *ordersRoutes) createOrder(c *gin.Context) {
	var body orderCreateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	for _, item := range body.Items {
		if item.Quantity < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "quantity of item cant be less than 1"})
			return
		}
	}

	id, err := r.ordersService.Create(c,
		body.CourierID,
		body.ClientID,
		body.AddressFrom,
		body.AddressTo,
		body.Notes,
		body.DeliverTo,
		body.Items,
		body.DeliveryCost,
	)
	if err != nil {
		if errors.Is(err, service.ErrItemNotEnough) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		} else {
			slog.Error("failed to create order", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed create order"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}

func (r *ordersRoutes) updateOrder(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	var body orderUpdateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	if body.Status != nil && !(*body.Status == entity.OrderStatusNotReady ||
		*body.Status == entity.OrderStatusReady ||
		*body.Status == entity.OrderStatusInDelivery ||
		*body.Status == entity.OrderStatusDone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("order status cant be equal to: %s", *body.Status)})
		return
	}

	for _, item := range *body.Items {
		if item.Quantity < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "quantity of item cant be less than 1"})
			return
		}
	}

	err = r.ordersService.Update(c,
		id,
		body.CourierID,
		body.ClientID,
		body.AddressFrom,
		body.AddressTo,
		body.Notes,
		body.Status,
		body.DeliverTo,
		body.DeliveredAt,
		body.Items,
		body.DeliveryCost,
		body.TotalCost,
	)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "order with such ID does not exist"})
		} else {
			slog.Error("failed to update order", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed update order"})
		}
		return
	}

	c.Status(http.StatusOK)
}

func (r *ordersRoutes) finishOrder(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	err = r.ordersService.Update(c, id, nil, nil, nil, nil, nil, &entity.OrderStatusDone, nil, nil, nil, nil, nil)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "order with such ID does not exist"})
		} else {
			slog.Error("failed to update order", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed update order"})
		}
		return
	}

	c.Status(http.StatusOK)
}

func (r *ordersRoutes) deleteOrder(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	err = r.ordersService.DeleteByID(c, id)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "order with such ID does not exist"})
		} else {
			slog.Error("failed to delete order", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed delete order"})
		}
		return
	}

	c.Status(http.StatusOK)
}
