package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
)

type (
	courierRepository interface {
		IsExistsById(ctx context.Context, id uint64) (bool, error)
		GetCouriers(ctx context.Context) ([]entity.Courier, error)
		Create(ctx context.Context, name string, phoneNumber *string, carNumber *string, notes *string) (uint64, error)
		Update(ctx context.Context, id uint64, name *string, phoneNumber *string, carNumber *string, status *string, notes *string) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	Couriers struct {
		courierRepository courierRepository
	}
)

var (
	ErrCourierNotExists = errors.New("courier with this id not exists")
)

func NewCouriersService(courierRepository courierRepository) *Couriers {
	return &Couriers{courierRepository: courierRepository}
}

func (c *Couriers) GetCouriers(ctx context.Context) ([]entity.Courier, error) {
	couriers, err := c.courierRepository.GetCouriers(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get couriers: %w", err)
	}

	return couriers, nil
}

func (c *Couriers) Create(ctx context.Context, name string, phoneNumber *string, carNumber *string, notes *string) (uint64, error) {
	id, err := c.courierRepository.Create(ctx, name, phoneNumber, carNumber, notes)
	if err != nil {
		return 0, fmt.Errorf("failed to create courier: %w", err)
	}

	return id, nil
}

func (c *Couriers) Update(ctx context.Context, id uint64, name *string, phoneNumber *string, carNumber *string, status *string, notes *string) error {
	isExists, err := c.courierRepository.IsExistsById(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to check existance: %w", err)
	}
	if !isExists {
		return ErrCourierNotExists
	}

	err = c.courierRepository.Update(ctx, id, name, phoneNumber, carNumber, status, notes)
	if err != nil {
		return fmt.Errorf("failed to update courier: %w", err)
	}

	return nil
}

func (c *Couriers) DeleteByID(ctx context.Context, id uint64) error {
	err := c.courierRepository.DeleteByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrCourierNotExists
		}
		return fmt.Errorf("failed to delete courier: %w", err)
	}

	return nil
}
