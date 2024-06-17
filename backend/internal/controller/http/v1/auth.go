package v1

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthRoutes struct {
	authService service.AuthService
}

type AuthBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func newAuthRoutes(g *gin.RouterGroup, authService service.AuthService) {
	authR := AuthRoutes{authService: authService}

	auth := g.Group("/auth")
	{
		auth.POST("login", authR.login)
		auth.POST("register", authR.register)
	}
}

func (r *AuthRoutes) login(c *gin.Context) {
	var body AuthBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}
	if body.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email is required"})
		return
	}
	if body.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is required"})
		return
	}

	token, user, err := r.authService.Login(c, body.Email, body.Password)
	if err != nil {
		slog.Error(err.Error())
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "email": user.Email, "role": user.Role})
}

func (r *AuthRoutes) register(c *gin.Context) {
	var body AuthBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body parsing error"})
		return
	}
	if body.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email is required"})
		return
	}
	if body.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is required"})
		return
	}

	id, err := r.authService.RegisterUser(c, body.Email, body.Password)
	if err != nil {
		slog.Error(err.Error())
		switch {
		case errors.Is(err, service.ErrUserAlreadyExists):
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		default:
			c.Status(http.StatusInternalServerError)
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_id": id})
}
