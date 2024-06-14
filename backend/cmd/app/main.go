package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"

	"github.com/NikolaB131/logistics-management-system/config"
	v1 "github.com/NikolaB131/logistics-management-system/internal/controller/http/v1"
	"github.com/NikolaB131/logistics-management-system/internal/controller/http/v1/middlewares"
	postgresRepo "github.com/NikolaB131/logistics-management-system/internal/repository/postgres"
	"github.com/NikolaB131/logistics-management-system/internal/service"
	"github.com/NikolaB131/logistics-management-system/pkg/postgres"
	"github.com/gin-gonic/gin"
)

func main() {
	// Config
	config, err := config.NewConfig(nil)
	if err != nil {
		panic(err)
	}

	// Logger
	initLogger(config.Logger.Level)
	slog.Info("Logger initialized", slog.String("level", config.Logger.Level))

	// Postgres
	pg, err := postgres.New(config.DB.Url)
	if err != nil {
		panic(err)
	}
	defer pg.Close()

	// Repositories
	userRepository := postgresRepo.NewUserRepository(pg)

	// Services
	authService := service.NewAuthService(userRepository, config.Auth.SignSecret, config.Auth.TokenTTL)

	// Creating admin user
	adminID, err := authService.RegisterUser(context.Background(), config.Auth.AdminUsername, config.Auth.AdminPassword)
	if !errors.Is(err, service.ErrUserAlreadyExists) {
		if err != nil {
			panic(fmt.Sprintf("unable to create admin user: %s", err.Error()))
		}
		err = authService.MakeAdmin(context.Background(), adminID)
		if err != nil {
			panic(fmt.Sprintf("unable to grant permissions to admin user: %s", err.Error()))
		}
	}

	// Middlewares
	middlewares := middlewares.New(config, userRepository)

	// Routes
	r := gin.New()
	v1.NewRouter(r, middlewares, authService)

	r.Run(fmt.Sprintf(":%d", config.HTTP.Port))
}

func initLogger(logLevel string) {
	level := slog.LevelDebug

	switch logLevel {
	case "error":
		level = slog.LevelError
	case "warn":
		level = slog.LevelWarn
	case "info":
		level = slog.LevelInfo
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: level, AddSource: true}))
	slog.SetDefault(logger)
}