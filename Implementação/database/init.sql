CREATE SCHEMA IF NOT EXISTS lab_db;

USE lab_db;

CREATE TABLE IF NOT EXISTS Users (
    id bigint not null auto_increment,
    name varchar(80) not null,
    password text not null,
    email varchar(64) unique not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Addresses (
    id bigint not null auto_increment,
    state varchar(32) not null,
    city varchar(32) not null,
    street varchar(80) not null,
    postal_code bigint not null,
    country varchar(32) not null,
    user_id bigint not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Students (
    id bigint not null auto_increment,
    user_id bigint not null unique,
    rg bigint unique not null,
    school varchar(80),
    course varchar(80) not null,
    balance bigint not null default 0,
    address_id bigint not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (address_id) REFERENCES Addresses(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Teachers (
    id bigint not null auto_increment,
    user_id bigint not null unique,
    cpf bigint unique not null,
    department varchar(80) not null,
    balance bigint not null default 1000,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Partners (
    id bigint not null auto_increment,
    user_id bigint not null unique,
    sector varchar(80) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Transactions (
    id bigint not null auto_increment,
    type enum('debit', 'credit') not null,
    value int not null default 0,
    description text default null,
    origin bigint not null,
    target bigint not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (origin) REFERENCES Users(id),
    FOREIGN KEY (target) REFERENCES Users(id),
    PRIMARY KEY(id)
);
