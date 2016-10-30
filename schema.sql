DROP TABLE IF EXISTS drugs;
CREATE TABLE drugs (
  id SERIAL PRIMARY KEY,
  drug_name VARCHAR NOT NULL,
  compound_name VARCHAR NOT NULL,
  pub_chem_id INTEGER,
  molecular_formula VARCHAR,
  molecular_weight DECIMAL,
  cas VARCHAR,
  log_p DECIMAL,
  h_bond_donor_count INTEGER,
  h_bond_acceptor_count INTEGER,
  rotatable_bond_count INTEGER,
  polar_surface_area DECIMAL,
  heavy_atom_count INTEGER,
  formal_charge INTEGER,
  complexity INTEGER,
  defined_stereocenter_count INTEGER,
  undefined_stereocenter_count INTEGER,
  melting_point_range VARCHAR,
  ld_50 DECIMAL,
  smiles TEXT,
  iupac_name TEXT
);
