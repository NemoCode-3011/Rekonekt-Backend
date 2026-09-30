export const createCulturalGroupsTable = `
CREATE TABLE IF NOT EXISTS cultural_groups(
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE,
language VARCHAR(100),
region VARCHAR(100),
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createUsersTable = `
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role VARCHAR(30) NOT NULL DEFAULT 'visitor'
CHECK(role IN('super admin', 'admin', 'visitor')),
cultural_group_id INT REFERENCES cultural_groups(id) ON DELETE SET NULL,
preferred_language VARCHAR(20) DEFAULT 'en',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createExhibitionsTable = `
CREATE TABLE IF NOT EXISTS exhibitions(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL UNIQUE,
subtitle VARCHAR(500),
description TEXT,
start_date DATE,
end_date DATE,
cover_image_url VARCHAR(500),
status VARCHAR(30) NOT NULL DEFAULT 'draft'
CHECK(status IN('draft', 'published', 'archived')),
published_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

export const createSectionsTable = `
CREATE TABLE IF NOT EXISTS sections(
id SERIAL PRIMARY KEY,
exhibition_id INT NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL,
introduction TEXT,
section_order INT NOT NULL,
hero_image_url VARCHAR(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(exhibition_id, slug),
UNIQUE(exhibition_id, section_order)
)
`;
export const createStoriesTable = `
CREATE TABLE IF NOT EXISTS stories(
id SERIAL PRIMARY KEY,
section_id INT REFERENCES sections(id) ON DELETE SET NULL,
title VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL UNIQUE,
excerpt TEXT,
content TEXT,
cover_image_url VARCHAR(500),
status VARCHAR(30) NOT NULL DEFAULT 'draft'
CHECK(status IN('draft', 'published', 'archived')),
published_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createEventsTable = `
CREATE TABLE IF NOT EXISTS events(
id SERIAL PRIMARY KEY,
section_id INT REFERENCES sections(id) ON DELETE SET NULL,
title VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL,
description TEXT,
event_date DATE,
date_display VARCHAR(100),
image_url VARCHAR(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(section_id, slug)
)
`;
export const createPeopleTable = `
CREATE TABLE IF NOT EXISTS people(
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL UNIQUE,
description TEXT,
birth_date DATE,
death_date DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createPlacesTable = `
CREATE TABLE IF NOT EXISTS places(
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
latitude DECIMAL(10,7),
longitude DECIMAL(10,7),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createArtifactsTable = `
CREATE TABLE IF NOT EXISTS artifacts(
id SERIAL PRIMARY KEY,
section_id INT REFERENCES sections(id) ON DELETE SET NULL,
title VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL UNIQUE,
artifact_type VARCHAR(100),
description TEXT,
historical_context TEXT,
date_display VARCHAR(100),
place_id INT REFERENCES places(id) ON DELETE SET NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createEventPlacesTable = `
CREATE TABLE IF NOT EXISTS event_places(
event_id INT REFERENCES events(id) ON DELETE CASCADE,
place_id INT REFERENCES places(id) ON DELETE CASCADE,
PRIMARY KEY(event_id, place_id)
)
`;
export const createEventPeopleTable = `
CREATE TABLE IF NOT EXISTS event_people(
event_id INT REFERENCES events(id) ON DELETE CASCADE,
person_id INT REFERENCES people(id) ON DELETE CASCADE,
PRIMARY KEY(event_id, person_id)
)
`;
export const createMediaTable = `
CREATE TABLE IF NOT EXISTS media(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
media_type VARCHAR(50) NOT NULL
CHECK(media_type IN('image', 'document', 'audio', 'video')),
file_url VARCHAR(1000) NOT NULL,
caption TEXT,
description TEXT,
source_credit VARCHAR(500),
license VARCHAR(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createMediaAttachmentsTable = `
CREATE TABLE IF NOT EXISTS media_attachments(
id SERIAL PRIMARY KEY,
media_id INT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
exhibition_id INT REFERENCES exhibitions(id) ON DELETE CASCADE,
section_id INT REFERENCES sections(id) ON DELETE CASCADE,
event_id INT REFERENCES events(id) ON DELETE CASCADE,
person_id INT REFERENCES people(id) ON DELETE CASCADE,
place_id INT REFERENCES places(id) ON DELETE CASCADE,
artifact_id INT REFERENCES artifacts(id) ON DELETE CASCADE,
display_order INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createSourcesTable = `
CREATE TABLE IF NOT EXISTS sources(
id SERIAL PRIMARY KEY,
title VARCHAR(500) NOT NULL,
author VARCHAR(255),
publication VARCHAR(255),
source_type VARCHAR(100),
publication_date DATE,
url VARCHAR(1000),
citation TEXT,
rights_statement TEXT,
perspective_note TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createSourceLinksTable = `
CREATE TABLE IF NOT EXISTS source_links(
id SERIAL PRIMARY KEY,
source_id INT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
section_id INT REFERENCES sections(id) ON DELETE CASCADE,
event_id INT REFERENCES events(id) ON DELETE CASCADE,
person_id INT REFERENCES people(id) ON DELETE CASCADE,
artifact_id INT REFERENCES artifacts(id) ON DELETE CASCADE,
relationship VARCHAR(50),
display_order INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createBookmarksTable = `
CREATE TABLE IF NOT EXISTS bookmarks(
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
artifact_id INT NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(user_id, artifact_id)
)
`;
export const createNotesTable = `
CREATE TABLE IF NOT EXISTS notes(
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(255),
content TEXT NOT NULL,
note_date DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
export const createProgressTable = `
CREATE TABLE IF NOT EXISTS progress(
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
exhibition_id INT NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
section_id INT REFERENCES sections(id) ON DELETE SET NULL,
last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
completed BOOLEAN DEFAULT FALSE,
UNIQUE(user_id, exhibition_id)
)
`;
export const alterUsersTableAddIsVerified = `
  ALTER TABLE users
  ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;
`;
export const alterUsersTableAddGoogleId = `
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
`;