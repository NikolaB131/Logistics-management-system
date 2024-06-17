package postgres

import (
	"context"
	"fmt"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
	"github.com/NikolaB131/logistics-management-system/pkg/postgres"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CouriersRepository struct {
	Pool *pgxpool.Pool
}

func NewCouriersRepository(pg *postgres.Postgres) *CouriersRepository {
	return &CouriersRepository{Pool: pg.Pool}
}

func (r *CouriersRepository) IsExistsById(ctx context.Context, id uint64) (bool, error) {
	isExists := false
	err := r.Pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM couriers WHERE id = $1)", id).Scan(&isExists)
	if err != nil {
		return false, fmt.Errorf("failed query: %w", err)
	}

	return isExists, nil
}

func (r *CouriersRepository) GetCouriers(ctx context.Context) ([]entity.Courier, error) {
	rows, err := r.Pool.Query(ctx, "SELECT * FROM couriers")
	if err != nil {
		return nil, fmt.Errorf("failed select: %w", err)
	}

	var couriers []entity.Courier
	for rows.Next() {
		var courier entity.Courier
		var phoneNumber, carNumber, notes *string
		err := rows.Scan(&courier.ID, &courier.Name, &phoneNumber, &carNumber, &courier.Status, &notes)
		if err != nil {
			return nil, fmt.Errorf("failed scan row: %w", err)
		}
		if phoneNumber == nil {
			courier.PhoneNumber = ""
		} else {
			courier.PhoneNumber = *phoneNumber
		}
		if carNumber == nil {
			courier.CarNumber = ""
		} else {
			courier.CarNumber = *carNumber
		}
		if notes == nil {
			courier.Notes = ""
		} else {
			courier.Notes = *notes
		}
		couriers = append(couriers, courier)
	}

	return couriers, nil
}

func (r *CouriersRepository) Create(ctx context.Context, name string, phoneNumber *string, carNumber *string, notes *string) (uint64, error) {
	row := r.Pool.QueryRow(ctx,
		"INSERT INTO couriers (name, phone_number, car_number, notes) VALUES($1, $2, $3, $4) RETURNING id",
		name, phoneNumber, carNumber, notes,
	)

	var id uint64
	if err := row.Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to scan db row: %w", err)
	}

	return id, nil
}

func (r *CouriersRepository) Update(ctx context.Context, id uint64, name *string, phoneNumber *string, carNumber *string, status *string, notes *string) error {
	tx, err := r.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	update := func(dbField string, value any) error {
		query := fmt.Sprintf("UPDATE couriers SET %s = $1 WHERE id = $2", dbField)
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

	if status != nil && *status != "" {
		err := update("status", *status)
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

	if carNumber != nil {
		if *carNumber == "" {
			err = update("car_number", nil)
		} else {
			err = update("car_number", *carNumber)
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

func (r *CouriersRepository) DeleteByID(ctx context.Context, id uint64) error {
	res, err := r.Pool.Exec(ctx, "DELETE FROM couriers WHERE id = $1", id)
	if res.RowsAffected() == 0 {
		return repository.ErrNotFound
	}
	if err != nil {
		return fmt.Errorf("failed to delete: %w", err)
	}

	return nil
}
