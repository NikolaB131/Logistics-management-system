package entity

import "time"

type Item struct {
	ID             uint64     `json:"id" db:"id"`
	Name           string     `json:"name" db:"name"`
	Quantity       int        `json:"quantity" db:"quantity"`
	Cost           float32    `json:"cost" db:"cost"`
	LastSupplyDate *time.Time `json:"last_supply_date" db:"last_supply_date"`
}
