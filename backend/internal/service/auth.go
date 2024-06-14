package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/NikolaB131/logistics-management-system/internal/app/jwt"
	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type (
	AuthService interface {
		Login(ctx context.Context, email string, password string) (string, error)
		RegisterUser(ctx context.Context, email string, password string) (string, error)
		MakeAdmin(ctx context.Context, userID string) error
	}

	Auth struct {
		userRepository repository.User
		signSecret     string
		tokenTTL       time.Duration
	}
)

var (
	ErrUserAlreadyExists  = errors.New("user with this email already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

func NewAuthService(userRepository repository.User, signSecret string, tokenTTL time.Duration) *Auth {
	return &Auth{
		userRepository: userRepository,
		signSecret:     signSecret,
		tokenTTL:       tokenTTL,
	}
}

func (a *Auth) Login(ctx context.Context, email string, password string) (string, error) {
	user, err := a.userRepository.User(ctx, email)
	if err != nil {
		return "", fmt.Errorf("failed to check if user exists: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(password)); err != nil {
		return "", ErrInvalidCredentials
	}

	signedToken, err := jwt.Generate(a.signSecret, a.tokenTTL, user.ID, user.Email)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return signedToken, nil
}

func (a *Auth) RegisterUser(ctx context.Context, email string, password string) (string, error) {
	_, err := a.userRepository.User(ctx, email)
	if err == nil {
		return "", ErrUserAlreadyExists
	} else if !errors.Is(err, repository.ErrNotFound) {
		return "", fmt.Errorf("failed to check if user exists: %w", err)
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to generate password hash: %w", err)
	}

	userId, err := a.userRepository.SaveUser(ctx, entity.User{Email: email, PasswordHash: passwordHash})
	if err != nil {
		return "", fmt.Errorf("failed to save user: %w", err)
	}

	slog.Info(fmt.Sprintf("registered user with email: %s", email))
	return userId, nil
}

func (a *Auth) MakeAdmin(ctx context.Context, userID string) error {
	return a.userRepository.GrantAdminPermission(ctx, userID)
}
