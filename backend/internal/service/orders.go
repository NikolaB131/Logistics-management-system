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
	EnhancedOrderItem struct {
		ID       uint64 `json:"id"`
		Name     string `json:"name"`
		Quantity int    `json:"quantity"`
	}

	EnhancedOrder struct {
		entity.Order
		Items []EnhancedOrderItem `json:"items"`
	}

	orderRepository interface {
		IsExistsById(ctx context.Context, id uint64) (bool, error)
		GetOrders(ctx context.Context) ([]entity.Order, error)
		Create(ctx context.Context,
			clientID uint64,
			addressFrom string,
			addressTo string,
			notes *string,
			deliverTo time.Time,
			items []entity.OrderItem,
			deliveryCost float32,
			totalCost float32,
		) (uint64, error)
		Update(ctx context.Context,
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
		) error
		DeleteByID(ctx context.Context, id uint64) error
	}

	ordersItemsRepository interface {
		GetItemByID(ctx context.Context, id uint64) (entity.Item, error)
		Update(ctx context.Context, id uint64, name *string, quantity *int, cost *float32, lastSupplyDate *time.Time) error
	}

	couriersRepository interface {
		Update(ctx context.Context, id uint64, name *string, phoneNumber *string, carNumber *string, status *string, notes *string) error
	}

	Orders struct {
		orderRepository    orderRepository
		itemsRepository    ordersItemsRepository
		couriersRepository couriersRepository
	}
)

var (
	ErrOrderNotExists = errors.New("order with this id not exists")
	ErrItemNotEnough  = errors.New("item is not enough")
)

func NewOrdersService(orderRepository orderRepository, itemsRepository ordersItemsRepository, couriersRepository couriersRepository) *Orders {
	return &Orders{orderRepository, itemsRepository, couriersRepository}
}

func (c *Orders) GetOrders(ctx context.Context) ([]EnhancedOrder, error) {
	var enhancedOrders []EnhancedOrder
	orders, err := c.orderRepository.GetOrders(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders: %w", err)
	}
	for _, order := range orders {
		var newItems []EnhancedOrderItem
		for _, item := range order.Items {
			dbItem, err := c.itemsRepository.GetItemByID(ctx, item.ID)
			if err != nil {
				return nil, fmt.Errorf("failed to get item by id: %w", err)
			}
			newItems = append(newItems, EnhancedOrderItem{ID: item.ID, Name: dbItem.Name, Quantity: item.Quantity})
		}
		enhancedOrders = append(enhancedOrders, EnhancedOrder{Order: order, Items: newItems})
	}

	return enhancedOrders, nil
}

func (c *Orders) Create(ctx context.Context,
	clientID uint64,
	addressFrom string,
	addressTo string,
	notes *string,
	deliverTo time.Time,
	items []entity.OrderItem,
	deliveryCost float32,
) (uint64, error) {
	var totalCost float32
	var updatedQuantityArr []struct {
		id       uint64
		quantity int
	}
	for _, item := range items {
		dbItem, err := c.itemsRepository.GetItemByID(ctx, item.ID)
		if err != nil {
			return 0, fmt.Errorf("failed to calculate order total cost: %w", err)
		}
		if dbItem.Quantity < item.Quantity {
			return 0, fmt.Errorf("%w: %s", ErrItemNotEnough, dbItem.Name)
		}
		updatedQuantityArr = append(updatedQuantityArr, struct {
			id       uint64
			quantity int
		}{dbItem.ID, dbItem.Quantity - item.Quantity})
		totalCost += dbItem.Cost * float32(item.Quantity)
	}

	id, err := c.orderRepository.Create(ctx, clientID, addressFrom, addressTo, notes, deliverTo, items, deliveryCost, totalCost)
	if err != nil {
		return 0, fmt.Errorf("failed to create order: %w", err)
	}

	for _, item := range updatedQuantityArr {
		err := c.itemsRepository.Update(ctx, item.id, nil, &item.quantity, nil, nil)
		if err != nil {
			return 0, fmt.Errorf("failed to decrease quantity: %w", err)
		}
	}

	return id, nil
}

func (c *Orders) Update(ctx context.Context,
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
	isExists, err := c.orderRepository.IsExistsById(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to check existance: %w", err)
	}
	if !isExists {
		return ErrOrderNotExists
	}

	err = c.orderRepository.Update(ctx,
		id,
		courierID,
		clientID,
		addressFrom,
		addressTo,
		notes,
		status,
		deliverTo,
		deliveredAt,
		items,
		deliveryCost,
		totalCost,
	)
	if err != nil {
		return fmt.Errorf("failed to update order: %w", err)
	}
	if courierID != nil {
		err := c.couriersRepository.Update(ctx, *courierID, nil, nil, nil, &entity.CourierStatusBusy, nil)
		if err != nil {
			return fmt.Errorf("failed to update courier status: %w", err)
		}
	}

	return nil
}

func (c *Orders) DeleteByID(ctx context.Context, id uint64) error {
	err := c.orderRepository.DeleteByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrOrderNotExists
		}
		return fmt.Errorf("failed to delete order: %w", err)
	}

	return nil
}
