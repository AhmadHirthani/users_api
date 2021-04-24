drop TABLE if exists users;

create table if not exists users(
    id SERIAL PRIMARY KEY NOT NULL,
    first_name varchar(255) NOT NULL,
    second_name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    reg_token TEXT
);




