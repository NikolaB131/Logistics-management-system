package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
	"github.com/NikolaB131/logistics-management-system/pkg/postgres"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ItemsRepository struct {
	Pool *pgxpool.Pool
}

func NewItemsRepository(pg *postgres.Postgres) *ItemsRepository {
	return &ItemsRepository{Pool: pg.Pool}
}

func (r *ItemsRepository) IsExistsById(ctx context.Context, id uint64) (bool, error) {
	isExists := false
	err := r.Pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM items WHERE id = $1)", id).Scan(&isExists)
	if err != nil {
		return false, fmt.Errorf("failed query: %w", err)
	}

	return isExists, nil
}

func (r *ItemsRepository) GetItems(ctx context.Context) ([]entity.Item, error) {
	rows, err := r.Pool.Query(ctx, "SELECT * FROM items")
	if err != nil {
		return nil, fmt.Errorf("failed select: %w", err)
	}

	// var items []entity.Item
	// for rows.Next() {
	// 	var item entity.Item
	// 	// var lastSupplyDate *time.Time
	// 	err := rows.Scan(&item.ID, &item.Name, &item.Quantity, &item.Cost, item.LastSupplyDate)
	// 	if err != nil {
	// 		return nil, fmt.Errorf("failed scan row: %w", err)
	// 	}
	// 	// if lastSupplyDate == nil {
	// 	// 	item.LastSupplyDate = nil
	// 	// } else {
	// 	// 	item.LastSupplyDate = *lastSupplyDate
	// 	// }
	// 	items = append(items, item)
	// }
	items, err := pgx.CollectRows(rows, pgx.RowToStructByName[entity.Item])
	if err != nil {
		return nil, fmt.Errorf("failed collecting rows: %w", err)
	}

	return items, nil
}

func (r *ItemsRepository) GetItemByID(ctx context.Context, id uint64) (entity.Item, error) {
	rows, err := r.Pool.Query(ctx, "SELECT * FROM items WHERE id = $1", id)
	if err != nil {
		return entity.Item{}, fmt.Errorf("failed query: %w", err)
	}
	item, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[entity.Item])
	if err != nil {
		return entity.Item{}, fmt.Errorf("collect row failed: %w", err)
	}

	return item, nil
}

func (r *ItemsRepository) Create(ctx context.Context, name string, quantity int, cost float32, lastSupplyDate *time.Time) (uint64, error) {
	row := r.Pool.QueryRow(ctx,
		"INSERT INTO items (name, quantity, cost, last_supply_date) VALUES($1, $2, $3, $4) RETURNING id",
		name, quantity, cost, lastSupplyDate,
	)

	var id uint64
	if err := row.Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to scan db row: %w", err)
	}

	return id, nil
}

func (r *ItemsRepository) Update(ctx context.Context, id uint64, name *string, quantity *int, cost *float32, lastSupplyDate *time.Time) error {
	tx, err := r.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	update := func(dbField string, value any) error {
		query := fmt.Sprintf("UPDATE items SET %s = $1 WHERE id = $2", dbField)
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

	if quantity != nil {
		err := update("quantity", *quantity)
		if err != nil {
			return err
		}
	}

	if cost != nil {
		err := update("cost", *cost)
		if err != nil {
			return err
		}
	}

	if lastSupplyDate != nil {
		err := update("last_supply_date", *lastSupplyDate)
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

func (r *ItemsRepository) DeleteByID(ctx context.Context, id uint64) error {
	res, err := r.Pool.Exec(ctx, "DELETE FROM items WHERE id = $1", id)
	if res.RowsAffected() == 0 {
		return repository.ErrNotFound
	}
	if err != nil {
		return fmt.Errorf("failed to delete: %w", err)
	}

	return nil
}
