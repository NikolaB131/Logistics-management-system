package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
	"github.com/NikolaB131/logistics-management-system/pkg/postgres"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OrdersRepository struct {
	Pool *pgxpool.Pool
}

func NewOrdersRepository(pg *postgres.Postgres) *OrdersRepository {
	return &OrdersRepository{Pool: pg.Pool}
}

func (r *OrdersRepository) IsExistsById(ctx context.Context, id uint64) (bool, error) {
	isExists := false
	err := r.Pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM orders WHERE id = $1)", id).Scan(&isExists)
	if err != nil {
		return false, fmt.Errorf("failed query: %w", err)
	}

	return isExists, nil
}

func (r *OrdersRepository) GetOrders(ctx context.Context) ([]entity.Order, error) {
	rows, err := r.Pool.Query(ctx, "SELECT * FROM orders")
	if err != nil {
		return nil, fmt.Errorf("failed select: %w", err)
	}

	var orders []entity.Order
	for rows.Next() {
		var order entity.Order
		var notes *string
		err := rows.Scan(
			&order.ID,
			&order.CourierID,
			&order.ClientID,
			&order.AddressFrom,
			&order.AddressTo,
			&notes,
			&order.Status,
			&order.CreatedAt,
			&order.DeliverTo,
			&order.DeliveredAt,
			&order.Items,
			&order.DeliveryCost,
			&order.TotalCost,
		)
		if err != nil {
			return nil, fmt.Errorf("failed scan row: %w", err)
		}
		if notes == nil {
			order.Notes = ""
		} else {
			order.Notes = *notes
		}
		orders = append(orders, order)
	}

	return orders, nil
}

func (r *OrdersRepository) Create(ctx context.Context,
	courierID uint64,
	clientID uint64,
	addressFrom string,
	addressTo string,
	notes *string,
	deliverTo time.Time,
	items []entity.OrderItem,
	deliveryCost float32,
	totalCost float32,
) (uint64, error) {
	row := r.Pool.QueryRow(ctx,
		"INSERT INTO orders (courier_id, client_id, address_from, address_to, notes, deliver_to, items, delivery_cost, total_cost) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
		courierID, clientID, addressFrom, addressTo, notes, deliverTo, items, deliveryCost, totalCost,
	)

	var id uint64
	if err := row.Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to scan db row: %w", err)
	}

	return id, nil
}

func (r *OrdersRepository) Update(ctx context.Context,
	id uint64,
	courierID *uint64,
	clientID *uint64,
	addressFrom *string,
	addressTo *string,
	notes *string,
	status *string,
	deliverTo *time.Time,
	deliveredAt *time.Time,
	items *[]entity.OrderItem,
	deliveryCost *float32,
	totalCost *float32,
) error {
	tx, err := r.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	update := func(dbField string, value any) error {
		query := fmt.Sprintf("UPDATE orders SET %s = $1 WHERE id = $2", dbField)
		_, err := tx.Exec(ctx, query, value, id)
		if err != nil {
			return fmt.Errorf("failed to update %s: %w", dbField, err)
		}
		return nil
	}

	if courierID != nil && *courierID != 0 {
		err := update("courier_id", *courierID)
		if err != nil {
			return err
		}
	}
	if clientID != nil && *clientID != 0 {
		err := update("client_id", *clientID)
		if err != nil {
			return err
		}
	}
	if addressFrom != nil && *addressFrom != "" {
		err := update("address_from", *addressFrom)
		if err != nil {
			return err
		}
	}
	if addressTo != nil && *addressTo != "" {
		err := update("address_to", *addressTo)
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
	if deliverTo != nil {
		err := update("deliver_to", *deliverTo)
		if err != nil {
			return err
		}
	}
	if deliveredAt != nil {
		err = update("delivered_at", *deliveredAt)
		if err != nil {
			return err
		}
	}
	if items != nil {
		err = update("items", *items)
		if err != nil {
			return err
		}
	}
	if deliveryCost != nil {
		err = update("delivery_cost", *deliveryCost)
		if err != nil {
			return err
		}
	}
	if totalCost != nil {
		err = update("total_cost", *totalCost)
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

func (r *OrdersRepository) DeleteByID(ctx context.Context, id uint64) error {
	res, err := r.Pool.Exec(ctx, "DELETE FROM orders WHERE id = $1", id)
	if res.RowsAffected() == 0 {
		return repository.ErrNotFound
	}
	if err != nil {
		return fmt.Errorf("failed to delete: %w", err)
	}

	return nil
}
