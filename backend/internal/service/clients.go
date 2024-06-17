package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/NikolaB131/logistics-management-system/internal/entity"
	"github.com/NikolaB131/logistics-management-system/internal/repository"
)

type (
	clientRepository interface {
		IsExistsById(ctx context.Context, id uint64) (bool, error)
		GetClients(ctx context.Context) ([]entity.Client, error)
		Create(ctx context.Context, name string, phoneNumber *string, notes *string) (uint64, error)
		Update(ctx context.Context, id uint64, name *string, phoneNumber *string, notes *string) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	Clients struct {
		clientRepository clientRepository
	}
)

var (
	ErrClientNotExists = errors.New("client with this id not exists")
)

func NewClientsService(clientRepository clientRepository) *Clients {
	return &Clients{clientRepository: clientRepository}
}

func (c *Clients) GetClients(ctx context.Context) ([]entity.Client, error) {
	clients, err := c.clientRepository.GetClients(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get clients: %w", err)
	}

	return clients, nil
}

func (c *Clients) Create(ctx context.Context, name string, phoneNumber *string, notes *string) (uint64, error) {
	id, err := c.clientRepository.Create(ctx, name, phoneNumber, notes)
	if err != nil {
		return 0, fmt.Errorf("failed to create client: %w", err)
	}

	return id, nil
}

func (c *Clients) Update(ctx context.Context, id uint64, name *string, phoneNumber *string, notes *string) error {
	isExists, err := c.clientRepository.IsExistsById(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to check existance: %w", err)
	}
	if !isExists {
		return ErrClientNotExists
	}

	err = c.clientRepository.Update(ctx, id, name, phoneNumber, notes)
	if err != nil {
		return fmt.Errorf("failed to update client: %w", err)
	}

	return nil
}

func (c *Clients) DeleteByID(ctx context.Context, id uint64) error {
	err := c.clientRepository.DeleteByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrClientNotExists
		}
		return fmt.Errorf("failed to delete client: %w", err)
	}

	return nil
}
