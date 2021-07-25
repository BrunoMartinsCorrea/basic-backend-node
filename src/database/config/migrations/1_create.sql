CREATE TABLE "user" (
  id BIGSERIAL NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,

  CONSTRAINT user_id_pkey PRIMARY KEY (id),
  CONSTRAINT user_email_key UNIQUE (email)
);

CREATE TABLE token (
  id BIGSERIAL NOT NULL,
  user_id BIGINT,
  access VARCHAR NOT NULL,
  refresh VARCHAR NOT NULL,

  CONSTRAINT token_id_pkey PRIMARY KEY (id),
  CONSTRAINT token_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user" (id),
  CONSTRAINT token_user_id_key UNIQUE (user_id)
);
