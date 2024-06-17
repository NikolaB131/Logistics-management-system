package v1

import (
	"context"
	"errors"
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
	WarehouseService interface {
		GetItems(ctx context.Context) ([]entity.Item, error)
		GetItemByID(ctx context.Context, id uint64) (entity.Item, error)
		Create(ctx context.Context, name string, quantity int, cost float32, lastSupplyDate *time.Time) (uint64, error)
		Update(ctx context.Context, id uint64, name *string, quantity *int, cost *float32, lastSupplyDate *time.Time) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	itemsRoutes struct {
		warehouseService WarehouseService
	}

	itemCreateBody struct {
		Name           string     `json:"name" binding:"required"`
		Quantity       int        `json:"quantity" binding:"required"`
		Cost           float32    `json:"cost" binding:"required"`
		LastSupplyDate *time.Time `json:"last_supply_date"`
	}

	itemUpdateBody struct {
		Name           *string    `json:"name"`
		Quantity       *int       `json:"quantity"`
		Cost           *float32   `json:"cost"`
		LastSupplyDate *time.Time `json:"last_supply_date"`
	}
)

func newWarehouseRoutes(g *gin.RouterGroup, warehouseService WarehouseService) {
	itemsR := itemsRoutes{warehouseService: warehouseService}

	items := g.Group("/item")
	{
		items.GET("", itemsR.getItems)
		items.GET(":id", itemsR.getItemByID)
		items.POST("", itemsR.createItem)
		items.PATCH(":id", itemsR.updateItem)
		items.DELETE(":id", itemsR.deleteItem)
	}
}

func (r *itemsRoutes) getItems(c *gin.Context) {
	items, err := r.warehouseService.GetItems(c)
	if err != nil {
		slog.Error("failed to get items", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed get items"})
		return
	}

	if len(items) == 0 {
		items = []entity.Item{}
	}

	c.JSON(http.StatusOK, items)
}

func (r *itemsRoutes) getItemByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	item, err := r.warehouseService.GetItemByID(c, id)
	if err != nil {
		if errors.Is(err, service.ErrItemNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "item with such ID does not exist"})
		} else {
			slog.Error("failed to get item", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed get items"})
		}
		return
	}

	c.JSON(http.StatusOK, item)
}

func (r *itemsRoutes) createItem(c *gin.Context) {
	var body itemCreateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	id, err := r.warehouseService.Create(c, body.Name, body.Quantity, body.Cost, body.LastSupplyDate)
	if err != nil {
		slog.Error("failed to create item", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed create item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}

func (r *itemsRoutes) updateItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	var body itemUpdateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	err = r.warehouseService.Update(c, id, body.Name, body.Quantity, body.Cost, body.LastSupplyDate)
	if err != nil {
		if errors.Is(err, service.ErrItemNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "item with such ID does not exist"})
		} else {
			slog.Error("failed to update item", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed update item"})
		}
		return
	}

	c.Status(http.StatusOK)
}

func (r *itemsRoutes) deleteItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	err = r.warehouseService.DeleteByID(c, id)
	if err != nil {
		if errors.Is(err, service.ErrItemNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "item with such ID does not exist"})
		} else {
			slog.Error("failed to delete item", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed delete item"})
		}
		return
	}

	c.Status(http.StatusOK)
}
