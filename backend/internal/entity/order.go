package entity

import "time"

var (
	OrderStatusNotReady   string = "not_ready"
	OrderStatusReady      string = "ready"
	OrderStatusInDelivery string = "in_delivery"
	OrderStatusDone       string = "done"
)

type (
	OrderItem struct {
		ID       uint64 `json:"id" db:"id"`
		Quantity int    `json:"quantity" db:"quantity"`
	}

	Order struct {
		ID           uint64      `json:"id" db:"id"`
		CourierID    uint64      `json:"courier_id" db:"courier_id"`
		ClientID     uint64      `json:"client_id" db:"client_id"`
		AddressFrom  string      `json:"address_from" db:"address_from"`
		AddressTo    string      `json:"address_to" db:"address_to"`
		Notes        string      `json:"notes" db:"notes"`
		Status       string      `json:"status" db:"status"`
		CreatedAt    time.Time   `json:"created_at" db:"created_at"`
		DeliverTo    time.Time   `json:"deliver_to" db:"deliver_to"`
		DeliveredAt  *time.Time  `json:"delivered_at" db:"delivered_at"`
		Items        []OrderItem `json:"items" db:"items"`
		DeliveryCost float32     `json:"delivery_cost" db:"delivery_cost"`
		TotalCost    float32     `json:"total_cost" db:"total_cost"`
	}
)
