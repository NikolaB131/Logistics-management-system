package repository

import (
	"context"
	"errors"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
)

var (
	ErrNotFound      = errors.New("not found")
	ErrAlreadyExists = errors.New("already exists")
)

type (
	User interface {
		SaveUser(ctx context.Context, user entity.User) (string, error)
		User(ctx context.Context, email string) (entity.User, error)
		GrantAdminPermission(ctx context.Context, userID string) error
	}
)
