package entity

var (
	CourierStatusFree string = "free"
	CourierStatusBusy string = "busy"
)

type Courier struct {
	ID          uint64 `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	PhoneNumber string `json:"phone_number" db:"phone_number"`
	CarNumber   string `json:"car_number" db:"car_number"`
	Status      string `json:"status" db:"status"`
	Notes       string `json:"notes" db:"notes"`
}
