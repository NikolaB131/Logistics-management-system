package entity

import "time"

type User struct {
	ID           uint64    `db:"id"`
	Email        string    `db:"email"`
	PasswordHash []byte    `db:"password_hash"`
	Role         string    `db:"role"`
	CreatedAt    time.Time `db:"created_at"`
}
