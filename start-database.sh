#!/bin/bash

# Container configuration
CONTAINER_NAME="dating-app-db"

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo "Error: .env.local file not found"
    exit 1
fi

# Check if container exists
if [ ! "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "Creating new database container..."
    docker run --name $CONTAINER_NAME \
        -e POSTGRES_DB=$DB_NAME \
        -e POSTGRES_USER=$DB_USER \
        -e POSTGRES_PASSWORD=$DB_PASSWORD \
        -p $DB_PORT:5432 \
        -d postgres:latest
else
    echo "Starting existing database container..."
    docker start $CONTAINER_NAME
fi

# Wait for database to be ready
echo "Waiting for database to start..."
sleep 5

# Create tables if they don't exist
echo "Creating tables if they don't exist..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << 'EOF'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), 
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified TIMESTAMPTZ DEFAULT NULL,
    profile_picture TEXT DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    phone_number VARCHAR(20) DEFAULT NULL, 
    address TEXT DEFAULT NULL, 
    password_hash TEXT NOT NULL, 
    first_name VARCHAR(50) NOT NULL, 
    last_name VARCHAR(50) NOT NULL, 
    role VARCHAR(50) NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW(), 
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE, 
    session_token TEXT UNIQUE NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW(), 
    expires_at TIMESTAMPTZ NOT NULL, 
    user_agent TEXT DEFAULT NULL, 
    ip_address INET DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), 
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00,
    max_participants INTEGER DEFAULT 0,
    type VARCHAR(50) NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW(), 
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE, 
    activity_id TEXT REFERENCES activities(id) ON DELETE CASCADE, 
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL, 
    status VARCHAR(50) DEFAULT 'pending', 
    number_of_participants INTEGER DEFAULT 1,
    reservation_name VARCHAR(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id TEXT NOT NULL,
  liked_id TEXT NOT NULL,
  is_match BOOLEAN DEFAULT FALSE,
  activity_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_liker FOREIGN KEY (liker_id) REFERENCES users(id),
  CONSTRAINT fk_liked FOREIGN KEY (liked_id) REFERENCES users(id),
  CONSTRAINT unique_liker_liked UNIQUE (liker_id, liked_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id),
  CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users(id)
);

EOF

echo "Database is ready!"