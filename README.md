# IRCTC-like Railway Management System

A simple API for a railway reservation system similar to IRCTC, built with Node.js, Express, and PostgreSQL.

## Features

- User authentication (register, login)
- Train management (create, check availability)
- Booking management (create booking, view booking details)
- Admin and user role separation
- Secure API with JWT authentication
- Transaction support for booking seats

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Setup

1. Clone the repository
   ```
   git clone https://github.com/TheVinaySagar/irctc-assignment.git
   cd irctc-assignment
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a PostgreSQL database

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=irctc_db
   JWT_SECRET=your_jwt_secret_key
   ADMIN_API_KEY=your_admin_api_key
   ```

5. Start the server
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npx nodemon server.js
   ```

## API Endpoints

### Authentication

#### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2023-05-30T10:00:00.000Z",
  "updatedAt": "2023-05-30T10:00:00.000Z"
}
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Trains

#### Create a new train (Admin only)

```bash
curl -X POST http://localhost:5000/api/trains \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_admin_api_key" \
  -d '{
    "trainNumber": "12345",
    "source": "Delhi",
    "destination": "Mumbai",
    "totalSeats": 100,
    "availableSeats": 100
  }'
```

Response:
```json
{
  "id": 1,
  "trainNumber": "12345",
  "source": "Delhi",
  "destination": "Mumbai",
  "totalSeats": 100,
  "availableSeats": 100,
  "createdAt": "2023-05-30T10:05:00.000Z",
  "updatedAt": "2023-05-30T10:05:00.000Z"
}
```

#### Check seat availability

```bash
curl -X GET "http://localhost:5000/api/trains/availability?source=Delhi&destination=Mumbai"
```

Response:
```json
[
  {
    "id": 1,
    "trainNumber": "12345",
    "source": "Delhi",
    "destination": "Mumbai",
    "totalSeats": 100,
    "availableSeats": 100,
    "createdAt": "2023-05-30T10:05:00.000Z",
    "updatedAt": "2023-05-30T10:05:00.000Z"
  }
]
```

### Bookings

#### Book a seat

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "trainNumber": "12345",
    "seats": 2
  }'
```

Response:
```json
{
  "id": 1,
  "userId": 1,
  "trainId": 1,
  "seatsBooked": 2,
  "createdAt": "2023-05-30T10:10:00.000Z",
  "updatedAt": "2023-05-30T10:10:00.000Z"
}
```

#### Get booking details

```bash
curl -X GET http://localhost:5000/api/bookings/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "id": 1,
  "userId": 1,
  "trainId": 1,
  "seatsBooked": 2,
  "createdAt": "2023-05-30T10:10:00.000Z",
  "updatedAt": "2023-05-30T10:10:00.000Z",
  "Train": {
    "id": 1,
    "trainNumber": "12345",
    "source": "Delhi",
    "destination": "Mumbai",
    "totalSeats": 100,
    "availableSeats": 98
  },
  "User": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Database Schema

- **Users**: Stores user information (name, email, password, role)
- **Trains**: Stores train information (train number, source, destination, total seats, available seats)
- **Bookings**: Stores booking information (user ID, train ID, seats booked)

## Assumptions

1. Each booking can be for multiple seats (specified in the request)
2. Available seats are tracked per entire route (not segment-wise)
3. Admin API key is passed via the X-API-Key header
4. JWT is sent in the Authorization header as a Bearer token
5. Race conditions are handled with database transactions and row locking
6. A user cannot book seats on the same train multiple times (one booking per train per user)
7. The booking system does not handle seat selection, only the number of seats
8. Password is stored in hashed format using bcrypt
9. JWT expiry is set to 1 hour

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 409: Conflict
- 500: Server error
