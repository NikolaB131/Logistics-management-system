package entity

type Client struct {
	ID          uint64 `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	PhoneNumber string `json:"phone_number" db:"phone_number"`
	Notes       string `json:"notes" db:"notes"`
}
