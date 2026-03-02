CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'VENDOR')),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(500),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL CHECK (category IN ('MOVIE', 'CONCERT', 'SPORTS', 'THEATRE', 'COMEDY', 'CONFERENCE', 'OTHER')),
    city VARCHAR(100) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    venue_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    event_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price > 0),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    sold_seats INTEGER DEFAULT 0,
    locked_seats INTEGER DEFAULT 0,
    demand_score DECIMAL(5, 2) DEFAULT 1.0 CHECK (demand_score >= 0.5 AND demand_score <= 5.0),
    popularity_percentile DECIMAL(5, 2),
    banner_image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'SOLD_OUT', 'CANCELLED', 'COMPLETED')),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_status ON events(status);

CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    row_number VARCHAR(5) NOT NULL,
    column_number INTEGER,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('STANDARD', 'PREMIUM', 'VIP', 'PRESTIGE')),
    base_price DECIMAL(10, 2) NOT NULL,
    price_modifier DECIMAL(5, 2) DEFAULT 1.0,
    final_price DECIMAL(10, 2) GENERATED ALWAYS AS (base_price * price_modifier) STORED,
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LOCKED', 'BOOKED', 'BLOCKED')),
    locked_by UUID REFERENCES users(id),
    locked_until TIMESTAMP,
    booked_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, seat_number)
);
CREATE INDEX idx_seats_event_id ON seats(event_id);
CREATE INDEX idx_seats_status ON seats(status);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    event_id UUID NOT NULL REFERENCES events(id),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED')),
    qr_hash VARCHAR(500),
    qr_image_url VARCHAR(500),
    used_flag BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    booking_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);

CREATE TABLE booking_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES seats(id),
    price_at_booking DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id, seat_id)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(500),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50) CHECK (payment_method IN ('UPI', 'CARD', 'NETBANKING', 'WALLET')),
    status VARCHAR(50) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED')),
    failure_reason TEXT,
    failure_code VARCHAR(100),
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fraud_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(500),
    device_fingerprint VARCHAR(500),
    event_id UUID REFERENCES events(id),
    attempt_type VARCHAR(100) CHECK (attempt_type IN (
        'RAPID_BOOKING',
        'BULK_SEAT_GRAB',
        'SAME_IP_BULK',
        'PAYMENT_FAILURE_SPIKE',
        'UNUSUAL_LOCATION',
        'VELOCITY_SPIKE',
        'DUPLICATE_BOOKING'
    )),
    risk_score DECIMAL(5, 2) CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(50) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    details JSON,
    action_taken VARCHAR(100) CHECK (action_taken IN ('NONE', 'FLAGGED', 'BLOCKED', 'MANUAL_REVIEW')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE demand_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bookings_per_minute DECIMAL(10, 2),
    seats_locked_count INTEGER,
    seats_available_count INTEGER,
    avg_price_multiplier DECIMAL(5, 2),
    visitor_count INTEGER,
    conversion_rate DECIMAL(5, 2),
    calculated_demand_score DECIMAL(5, 2)
);

CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id),
    snapshot_date DATE NOT NULL,
    total_revenue DECIMAL(12, 2),
    total_bookings INTEGER,
    total_seats_sold INTEGER,
    conversion_rate DECIMAL(5, 2),
    avg_booking_value DECIMAL(10, 2),
    peak_booking_hour INTEGER,
    peak_booking_count INTEGER,
    fraud_attempts INTEGER,
    fraud_blocked_count INTEGER,
    predicted_final_revenue DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
