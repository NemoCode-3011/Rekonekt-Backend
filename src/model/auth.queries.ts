export const getUserByEmail = `
  SELECT * FROM users
  WHERE email = $1
`;

export const createUserQuery = `
  INSERT INTO users(
    name,
    email,
    password,
    preferred_language
  )
  VALUES($1, $2, $3, $4)
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
export const getUserByGoogleIdQuery = `
  SELECT
    id,
    name,
    email,
    role,
    preferred_language,
    is_verified
  FROM users
  WHERE google_id = $1;
`;

export const getUserByEmailForGoogleQuery = `
  SELECT
    id,
    name,
    email,
    role,
    preferred_language,
    is_verified,
    google_id
  FROM users
  WHERE email = $1;
`;

export const linkGoogleAccountQuery = `
  UPDATE users
  SET
    google_id = $1,
    is_verified = TRUE,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING
    id,
    name,
    email,
    role,
    preferred_language,
    is_verified;
`;

export const createGoogleUserQuery = `
  INSERT INTO users (
    name,
    email,
    password,
    google_id,
    is_verified,
    preferred_language
  )
  VALUES ($1, $2, $3, $4, TRUE, 'en')
  RETURNING
    id,
    name,
    email,
    role,
    preferred_language,
    is_verified;
`;
export const getUserForResendOtpQuery = `
  SELECT id, name, email, is_verified
  FROM users
  WHERE email = $1;
`;
export const updateUserPasswordQuery = `
  UPDATE users
  SET
    password = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE email = $2
  RETURNING id, name, email, role;
`;
export const updateUserProfileQuery = `
  UPDATE users
  SET
    name = $1,
    preferred_language = $2,
    cultural_group_id = $3,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $4
  RETURNING id, name, email, role, cultural_group_id, preferred_language, is_verified;
`;

export const getUserPasswordByIdQuery = `
  SELECT password
  FROM users
  WHERE id = $1;
`;

export const updateUserPasswordByIdQuery = `
  UPDATE users
  SET
    password = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING id;
`;
export const setupAdminPasswordQuery = `
  UPDATE users
  SET
    password = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
    AND role = 'admin'
  RETURNING id, name, email, role;
`;
export const getAdminsQuery = `
  SELECT id, name, email, role, created_at
  FROM users
  WHERE role IN ('admin', 'super admin')
  ORDER BY (role = 'super admin') DESC, created_at ASC;
`;

// Only plain admins can be revoked, so a super admin is never touched.
export const revokeAdminQuery = `
  UPDATE users
  SET role = 'visitor', updated_at = CURRENT_TIMESTAMP
  WHERE id = $1 AND role = 'admin'
  RETURNING id, name, email, role;
`;
