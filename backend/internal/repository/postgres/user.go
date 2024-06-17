package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
	"github.com/NikolaB131/logistics-management-system/pkg/postgres"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	Pool *pgxpool.Pool
}

func NewUserRepository(pg *postgres.Postgres) *ClientsRepository {
	return &ClientsRepository{Pool: pg.Pool}
}

func (r *ClientsRepository) User(ctx context.Context, email string) (entity.User, error) {
	var user entity.User

	row := r.Pool.QueryRow(ctx, "SELECT id, email, password_hash, role FROM users WHERE email = $1", email)
	err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.Role)

	if errors.Is(err, pgx.ErrNoRows) {
		return entity.User{}, repository.ErrNotFound
	}
	if err != nil {
		return entity.User{}, fmt.Errorf("failed to scan db row: %w", err)
	}

	return user, nil
}

func (r *ClientsRepository) SaveUser(ctx context.Context, user entity.User) (string, error) {
	var id string

	row := r.Pool.QueryRow(ctx,
		"INSERT INTO users (email, password_hash) VALUES($1, $2) RETURNING id",
		user.Email, user.PasswordHash,
	)
	err := row.Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to scan db row: %w", err)
	}

	return id, nil
}

func (r *ClientsRepository) GrantAdminPermission(ctx context.Context, userID string) error {
	_, err := r.Pool.Exec(ctx, "UPDATE users SET role = 'admin' WHERE id = $1", userID)
	return err
}
