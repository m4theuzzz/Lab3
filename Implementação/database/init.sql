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
    created_by bigint not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Student (
    user_id bigint not null unique,
    rg bigint unique not null,
    school varchar(80),
    course varchar(80) not null,
    address_id bigint not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (address_id) REFERENCES Addresses(id),
    PRIMARY KEY(rg)
);

CREATE TABLE IF NOT EXISTS Teacher (
    user_id bigint not null unique,
    cpf bigint unique not null,
    department varchar(80) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    PRIMARY KEY(cpf)
);

CREATE TABLE IF NOT EXISTS Partner (
    id bigint not null auto_increment,
    user_id bigint not null unique,
    sector varchar(80) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Transaction (
    id bigint not null auto_increment,
    type enum('debit', 'credit') not null,
    value int not null default 0,
    description text default null,
    created_by bigint not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (created_by) REFERENCES Users(id),
    PRIMARY KEY(id)
);
