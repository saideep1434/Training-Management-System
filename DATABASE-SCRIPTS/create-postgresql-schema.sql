-- ============================================
-- Schema Creation Script for Neon PostgreSQL
-- ============================================
-- Run this FIRST in Neon SQL Editor to create all tables
-- This ensures the schema exists before Spring Boot tries to access it

-- Create tables based on your JPA entities

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

-- 2. Register Associate table (for user registration/login)
CREATE TABLE IF NOT EXISTS register_associate (
    id BIGSERIAL PRIMARY KEY,
    associate_name VARCHAR(255),
    associate_id VARCHAR(255) UNIQUE,
    associate_email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50),
    password VARCHAR(255) NOT NULL
);

-- 3. Location table
CREATE TABLE IF NOT EXISTS location (
    location_id BIGSERIAL PRIMARY KEY,
    location_name VARCHAR(255) UNIQUE
);

-- 4. Domain table
CREATE TABLE IF NOT EXISTS domain (
    domain_id BIGSERIAL PRIMARY KEY,
    domain_name VARCHAR(255) UNIQUE
);

-- 5. Vertical table
CREATE TABLE IF NOT EXISTS vertical (
    vertical_id BIGSERIAL PRIMARY KEY,
    vertical_name VARCHAR(255) UNIQUE
);

-- 6. Service Line table
CREATE TABLE IF NOT EXISTS service_line (
    service_line_id BIGSERIAL PRIMARY KEY,
    service_line_name VARCHAR(255) UNIQUE
);

-- 7. Hire Type table
CREATE TABLE IF NOT EXISTS hire_type (
    hire_type_id BIGSERIAL PRIMARY KEY,
    hire_type_name VARCHAR(255) UNIQUE
);

-- 8. Learning Path table
CREATE TABLE IF NOT EXISTS learning_path (
    learning_path_id BIGSERIAL PRIMARY KEY,
    learning_path_name VARCHAR(255),
    description TEXT
);

-- 9. Coach table
CREATE TABLE IF NOT EXISTS coach (
    coach_id BIGSERIAL PRIMARY KEY,
    associate_id VARCHAR(255) UNIQUE,
    coach_name VARCHAR(255),
    coach_email VARCHAR(255)
);

-- 10. Mentor table
CREATE TABLE IF NOT EXISTS mentor (
    mentor_id BIGSERIAL PRIMARY KEY,
    associate_id VARCHAR(255) UNIQUE,
    mentor_name VARCHAR(255),
    mentor_email VARCHAR(255)
);

-- 11. Technical Trainer table
CREATE TABLE IF NOT EXISTS technical_trainer (
    tech_trainer_id BIGSERIAL PRIMARY KEY,
    associate_id VARCHAR(255) UNIQUE,
    tech_trainer_name VARCHAR(255),
    tech_trainer_email VARCHAR(255)
);

-- 12. BH Trainer table
CREATE TABLE IF NOT EXISTS bhtrainer (
    bhtrainer_id BIGSERIAL PRIMARY KEY,
    associate_id VARCHAR(255) UNIQUE,
    bhtrainer_name VARCHAR(255),
    bhtrainer_email VARCHAR(255)
);

-- 13. Cohort table
CREATE TABLE IF NOT EXISTS cohort (
    cohort_id BIGSERIAL PRIMARY KEY,
    cohort_name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    location_id BIGINT REFERENCES location(location_id),
    domain_id BIGINT REFERENCES domain(domain_id),
    vertical_id BIGINT REFERENCES vertical(vertical_id),
    service_line_id BIGINT REFERENCES service_line(service_line_id),
    hire_type_id BIGINT REFERENCES hire_type(hire_type_id),
    learning_path_id BIGINT REFERENCES learning_path(learning_path_id),
    coach_id BIGINT REFERENCES coach(coach_id),
    tech_trainer_id BIGINT REFERENCES technical_trainer(tech_trainer_id),
    bhtrainer_id BIGINT REFERENCES bhtrainer(bhtrainer_id)
);

-- 14. Trainee table
CREATE TABLE IF NOT EXISTS trainee (
    trainee_id BIGSERIAL PRIMARY KEY,
    associate_id VARCHAR(255) UNIQUE,
    trainee_name VARCHAR(255),
    trainee_email VARCHAR(255),
    cohort_id BIGINT REFERENCES cohort(cohort_id),
    domain_id BIGINT REFERENCES domain(domain_id),
    hire_type_id BIGINT REFERENCES hire_type(hire_type_id),
    location_id BIGINT REFERENCES location(location_id)
);

-- 15. Events/Calendar table
CREATE TABLE IF NOT EXISTS events (
    event_id BIGSERIAL PRIMARY KEY,
    event_title VARCHAR(255),
    event_description TEXT,
    event_date DATE,
    event_time TIME,
    cohort_id BIGINT REFERENCES cohort(cohort_id)
);

-- 16. Learning Path Day Entry table
CREATE TABLE IF NOT EXISTS learning_path_day_entry (
    id BIGSERIAL PRIMARY KEY,
    learning_path_id BIGINT REFERENCES learning_path(learning_path_id),
    day_number INTEGER,
    topics TEXT,
    description TEXT
);

-- 17. Verification Token table (for email verification)
CREATE TABLE IF NOT EXISTS verification_token (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE,
    user_id BIGINT,
    expiry_date TIMESTAMP
);

-- 18. Connection tables (many-to-many relationships)
CREATE TABLE IF NOT EXISTS coach_connect (
    id BIGSERIAL PRIMARY KEY,
    coach_id BIGINT REFERENCES coach(coach_id),
    cohort_id BIGINT REFERENCES cohort(cohort_id)
);

CREATE TABLE IF NOT EXISTS mentor_connect (
    id BIGSERIAL PRIMARY KEY,
    mentor_id BIGINT REFERENCES mentor(mentor_id),
    cohort_id BIGINT REFERENCES cohort(cohort_id)
);

CREATE TABLE IF NOT EXISTS trainer_connect (
    id BIGSERIAL PRIMARY KEY,
    tech_trainer_id BIGINT REFERENCES technical_trainer(tech_trainer_id),
    cohort_id BIGINT REFERENCES cohort(cohort_id)
);

CREATE TABLE IF NOT EXISTS bhconnect (
    id BIGSERIAL PRIMARY KEY,
    bhtrainer_id BIGINT REFERENCES bhtrainer(bhtrainer_id),
    cohort_id BIGINT REFERENCES cohort(cohort_id)
);

CREATE TABLE IF NOT EXISTS cohort_rep (
    id BIGSERIAL PRIMARY KEY,
    cohort_id BIGINT REFERENCES cohort(cohort_id),
    trainee_id BIGINT REFERENCES trainee(trainee_id)
);

CREATE TABLE IF NOT EXISTS calendar (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(event_id),
    cohort_id BIGINT REFERENCES cohort(cohort_id)
);

-- ============================================
-- Verify tables were created
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- USAGE INSTRUCTIONS
-- ============================================
-- 1. Go to https://console.neon.tech
-- 2. Select your project
-- 3. Click "SQL Editor"
-- 4. Copy and paste this ENTIRE script
-- 5. Click "Run"
-- 6. Verify you see all tables in the output
-- 7. Then redeploy your Render backend (or it will auto-redeploy)
-- 
-- After running this, Hibernate will use these existing tables
-- instead of trying to create them.
