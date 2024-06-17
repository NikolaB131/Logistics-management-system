package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
)

type (
	warehouseItemsRepository interface {
		IsExistsById(ctx context.Context, id uint64) (bool, error)
		GetItems(ctx context.Context) ([]entity.Item, error)
		GetItemByID(ctx context.Context, id uint64) (entity.Item, error)
		Create(ctx context.Context, name string, quantity int, cost float32, lastSupplyDate *time.Time) (uint64, error)
		Update(ctx context.Context, id uint64, name *string, quantity *int, cost *float32, lastSupplyDate *time.Time) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	Warehouse struct {
		itemsRepository warehouseItemsRepository
	}
)

var (
	ErrItemNotExists = errors.New("item with this id not exists")
)

func NewWarehouseService(itemsRepository warehouseItemsRepository) *Warehouse {
	return &Warehouse{itemsRepository}
}

func (w *Warehouse) GetItems(ctx context.Context) ([]entity.Item, error) {
	items, err := w.itemsRepository.GetItems(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get Items: %w", err)
	}

	return items, nil
}

func (w *Warehouse) GetItemByID(ctx context.Context, id uint64) (entity.Item, error) {
	item, err := w.itemsRepository.GetItemByID(ctx, id)
	if err != nil {
		return entity.Item{}, fmt.Errorf("failed to get item: %w", err)
	}

	return item, nil
}

func (w *Warehouse) Create(ctx context.Context, name string, quantity int, cost float32, lastSupplyDate *time.Time) (uint64, error) {
	id, err := w.itemsRepository.Create(ctx, name, quantity, cost, lastSupplyDate)
	if err != nil {
		return 0, fmt.Errorf("failed to create item: %w", err)
	}

	return id, nil
}

func (w *Warehouse) Update(ctx context.Context, id uint64, name *string, quantity *int, cost *float32, lastSupplyDate *time.Time) error {
	isExists, err := w.itemsRepository.IsExistsById(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to check existance: %w", err)
	}
	if !isExists {
		return ErrItemNotExists
	}

	err = w.itemsRepository.Update(ctx, id, name, quantity, cost, lastSupplyDate)
	if err != nil {
		return fmt.Errorf("failed to update item: %w", err)
	}

	return nil
}

func (w *Warehouse) DeleteByID(ctx context.Context, id uint64) error {
	err := w.itemsRepository.DeleteByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrItemNotExists
		}
		return fmt.Errorf("failed to delete item: %w", err)
	}

	return nil
}
