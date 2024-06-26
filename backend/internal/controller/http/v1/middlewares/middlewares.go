package middlewares

import (
	"context"
	"log/slog"
	"net/http"
	"strings"

	"github.com/NikolaB131/logistics-management-system/config"
	"github.com/NikolaB131/logistics-management-system/internal/app/jwt"
	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/gin-gonic/gin"
)

type (
	userRepository interface {
		User(ctx context.Context, email string) (entity.User, error)
	}

	Middlewares struct {
		config         *config.Config
		userRepository userRepository
	}
)

var (
	ErrParsingJWT = "error while parsing JWT token"
)

func New(config *config.Config, userRepository userRepository) Middlewares {
	return Middlewares{
		config:         config,
		userRepository: userRepository,
	}
}

func (m *Middlewares) OnlyAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorizationHeader := c.GetHeader("Authorization")
		if authorizationHeader == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		splitToken := strings.Split(authorizationHeader, "Bearer ")
		token := splitToken[1]

		if len(token) < 2 {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		claims, err := jwt.Parse(token, m.config.Auth.SignSecret)
		if err != nil {
			slog.Warn(ErrParsingJWT)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "token parsing error"})
			return
		}

		user, err := m.userRepository.User(c, claims.Email)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("user_role", user.Role)
		c.Next()
	}
}

func (m *Middlewares) OnlyAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if role != "admin" {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		c.Next()
	}
}
