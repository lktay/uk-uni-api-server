DROP TABLE IF EXISTS universities;
CREATE TABLE IF NOT EXISTS university (
  id SERIAL PRIMARY KEY,
  uniname VARCHAR,
  uniwebpage VARCHAR
 )