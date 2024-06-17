package postgres

import (
	"context"
	"fmt"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
	"github.com/NikolaB131/logistics-management-system/pkg/postgres"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ClientsRepository struct {
	Pool *pgxpool.Pool
}

func NewClientRepository(pg *postgres.Postgres) *ClientsRepository {
	return &ClientsRepository{Pool: pg.Pool}
}

func (r *ClientsRepository) IsExistsById(ctx context.Context, id uint64) (bool, error) {
	isExists := false
	err := r.Pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM clients WHERE id = $1)", id).Scan(&isExists)
	if err != nil {
		return false, fmt.Errorf("failed query: %w", err)
	}

	return isExists, nil
}

func (r *ClientsRepository) GetClients(ctx context.Context) ([]entity.Client, error) {
	rows, err := r.Pool.Query(ctx, "SELECT * FROM clients")
	if err != nil {
		return nil, fmt.Errorf("failed select: %w", err)
	}

	var clients []entity.Client
	for rows.Next() {
		var client entity.Client
		var phoneNumber, notes *string
		err := rows.Scan(&client.ID, &client.Name, &phoneNumber, &notes)
		if err != nil {
			return nil, fmt.Errorf("failed scan row: %w", err)
		}
		if notes == nil {
			client.Notes = ""
		} else {
			client.Notes = *notes
		}
		if phoneNumber == nil {
			client.PhoneNumber = ""
		} else {
			client.PhoneNumber = *phoneNumber
		}
		clients = append(clients, client)
	}

	return clients, nil
}

func (r *ClientsRepository) Create(ctx context.Context, name string, phoneNumber *string, notes *string) (uint64, error) {
	row := r.Pool.QueryRow(ctx, "INSERT INTO clients (name, phone_number, notes) VALUES($1, $2, $3) RETURNING id", name, phoneNumber, notes)

	var id uint64
	if err := row.Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to scan db row: %w", err)
	}

	return id, nil
}

func (r *ClientsRepository) Update(ctx context.Context, id uint64, name *string, phoneNumber *string, notes *string) error {
	tx, err := r.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	update := func(dbField string, value any) error {
		query := fmt.Sprintf("UPDATE clients SET %s = $1 WHERE id = $2", dbField)
		_, err := tx.Exec(ctx, query, value, id)
		if err != nil {
			return fmt.Errorf("failed to update %s: %w", dbField, err)
		}
		return nil
	}

	if name != nil && *name != "" {
		err := update("name", *name)
		if err != nil {
			return err
		}
	}

	if phoneNumber != nil {
		if *phoneNumber == "" {
			err = update("phone_number", nil)
		} else {
			err = update("phone_number", *phoneNumber)
		}
		if err != nil {
			return err
		}
	}

	if notes != nil {
		if *notes == "" {
			err = update("notes", nil)
		} else {
			err = update("notes", *notes)
		}
		if err != nil {
			return err
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *ClientsRepository) DeleteByID(ctx context.Context, id uint64) error {
	res, err := r.Pool.Exec(ctx, "DELETE FROM clients WHERE id = $1", id)
	if res.RowsAffected() == 0 {
		return repository.ErrNotFound
	}
	if err != nil {
		return fmt.Errorf("failed to delete: %w", err)
	}

	return nil
}
