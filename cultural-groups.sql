INSERT INTO cultural_groups (name, language, region) VALUES
  ('Yoruba',      'Yoruba',   'South-West'),
  ('Igbo',        'Igbo',     'South-East'),
  ('Hausa',       'Hausa',    'North'),
  ('Edo (Bini)',  'Edo',      'South-South'),
  ('Ijaw',        'Ijaw',     'South-South'),
  ('Efik',        'Efik',     'South-South'),
  ('Fulani',      'Fulfulde', 'North'),
  ('Tiv',         'Tiv',      'North-Central')
ON CONFLICT (name) DO NOTHING;