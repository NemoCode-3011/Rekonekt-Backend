export const getUserByEmail = `
  SELECT * FROM users
  WHERE email = $1
`;

export const createUserQuery = `
  INSERT INTO users(
    name,
    email,
    password,
    cultural_group_id,
    preferred_language
  )
  VALUES($1, $2, $3, $4, $5)
  RETURNING id, name, email, role, cultural_group_id, preferred_language, created_at;
`;
export const updateUserVerifiedQuery = `
  UPDATE users
  SET is_verified = TRUE,
  updated_at = CURRENT_TIMESTAMP
  WHERE email = $1
  RETURNING id, name, email, role, cultural_group_id, preferred_language, is_verified;
`;

export const getUserById = `
  SELECT
    id,
    name,
    email,
    role,
    cultural_group_id,
    preferred_language,
    is_verified
  FROM users
  WHERE id = $1
`;
export const createSuperAdminQuery = `
  INSERT INTO users (
    name,
    email,
    password,
    role,
    preferred_language,
    is_verified
  )
  VALUES ($1, $2, $3, 'super admin', 'en', TRUE)
  ON CONFLICT (email) DO NOTHING
  RETURNING id, name, email, role, is_verified;
`;

export const getUserRoleQuery = `
  SELECT role
  FROM users
  WHERE id = $1
`;
export const createAdminQuery = `
  INSERT INTO users (
    name,
    email,
    password,
    role,
    preferred_language,
    is_verified
  )
  VALUES ($1, $2, $3, 'admin', $4, TRUE)
  RETURNING
    id,
    name,
    email,
    role,
    preferred_language,
    is_verified,
    created_at;
`;
