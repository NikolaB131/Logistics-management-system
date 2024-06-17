package v1

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/NikolaB131/logistics-management-system/pkg/sl"
	"github.com/gin-gonic/gin"
)

type (
	ClientsService interface {
		GetClients(ctx context.Context) ([]entity.Client, error)
		Create(ctx context.Context, name string, phoneNumber *string, notes *string) (uint64, error)
		Update(ctx context.Context, id uint64, name *string, phoneNumber *string, notes *string) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	clientsRoutes struct {
		clientsService ClientsService
	}

	clientCreateBody struct {
		Name        string  `json:"name" binding:"required"`
		PhoneNumber *string `json:"phone_number"`
		Notes       *string `json:"notes"`
	}

	clientUpdateBody struct {
		Name        *string `json:"name"`
		PhoneNumber *string `json:"phone_number"`
		Notes       *string `json:"notes"`
	}
)

func newClientsRoutes(g *gin.RouterGroup, clientsService ClientsService) {
	clientsR := clientsRoutes{clientsService: clientsService}

	clients := g.Group("/client")
	{
		clients.GET("/", clientsR.getClients)
		clients.POST("/", clientsR.createClient)
		clients.PATCH("/:id", clientsR.updateClient)
		clients.DELETE("/:id", clientsR.deleteClient)
	}
}

func (r *clientsRoutes) getClients(c *gin.Context) {
	clients, err := r.clientsService.GetClients(c)
	if err != nil {
		slog.Error("failed to get clients", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed get clients"})
		return
	}

	if len(clients) == 0 {
		clients = []entity.Client{}
	}

	c.JSON(http.StatusOK, clients)
}

func (r *clientsRoutes) createClient(c *gin.Context) {
	var body clientCreateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	id, err := r.clientsService.Create(c, body.Name, body.PhoneNumber, body.Notes)
	if err != nil {
		slog.Error("failed to create client", sl.Err(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed create client"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}

func (r *clientsRoutes) updateClient(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	var body clientUpdateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}

	err = r.clientsService.Update(c, id, body.Name, body.PhoneNumber, body.Notes)
	if err != nil {
		if errors.Is(err, service.ErrClientNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "client with such ID does not exist"})
		} else {
			slog.Error("failed to update client", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed update client"})
		}
		return
	}

	c.Status(http.StatusOK)
}

func (r *clientsRoutes) deleteClient(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "specified id is not a number"})
		return
	}

	err = r.clientsService.DeleteByID(c, id)
	if err != nil {
		if errors.Is(err, service.ErrClientNotExists) {
			c.JSON(http.StatusNotFound, gin.H{"error": "client with such ID does not exist"})
		} else {
			slog.Error("failed to delete client", sl.Err(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed delete client"})
		}
		return
	}

	c.Status(http.StatusOK)
}
