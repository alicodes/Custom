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

username VARCHAR(30) REFERENCES deslogin (username) NOT NULL

CREATE TABLE templates(
    templateid SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    templateName VARCHAR(30) NOT NULL,
    templateType VARCHAR(30) NOT NULL,
    picture VARCHAR(320) NOT NULL,
    customid integer,
    description text
);

CREATE TABLE messages(
    messageid SERIAL PRIMARY KEY,
    senderid integer NOT NULL,
    recieverid integer NOT NULL,
    messagetext text NOT NULL,
    datetime TIMESTAMP NOT NULL
);