CREATE DATABASE customs;

CREATE TABLE deslogin(
    userid SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    email VARCHAR(320) NOT NULL
);

CREATE TABLE cuslogin(
    userid SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    email VARCHAR(320) NOT NULL
);