USE lab_db;

INSERT INTO Users (
    name,
    password,
    email
) VALUES (
    "jorgin",
    "5jNJIzhpDrYyxsPzS0Wvfwzx4e6Awr4+E35610gU4RLHoQSkfEXWVD5CK3DQfxBu3NwEjMsSwVidySHTK0hitvi/Cr7pkAy+AfAalE6wVJXlu6zZkBv9Eg/vIlAycVJr2zN4",
    "jorgin@test.com"
), (
    "aluno 1",
    "5jNJIzhpDrYyxsPzS0Wvfwzx4e6Awr4+E35610gU4RLHoQSkfEXWVD5CK3DQfxBu3NwEjMsSwVidySHTK0hitvi/Cr7pkAy+AfAalE6wVJXlu6zZkBv9Eg/vIlAycVJr2zN4",
    "matvsan@gmail.com"
), (
    "parceiro 1",
    "5jNJIzhpDrYyxsPzS0Wvfwzx4e6Awr4+E35610gU4RLHoQSkfEXWVD5CK3DQfxBu3NwEjMsSwVidySHTK0hitvi/Cr7pkAy+AfAalE6wVJXlu6zZkBv9Eg/vIlAycVJr2zN4",
    "parceiro@test.com"
), (
    "aluno 2",
    "5jNJIzhpDrYyxsPzS0Wvfwzx4e6Awr4+E35610gU4RLHoQSkfEXWVD5CK3DQfxBu3NwEjMsSwVidySHTK0hitvi/Cr7pkAy+AfAalE6wVJXlu6zZkBv9Eg/vIlAycVJr2zN4",
    "aluno2@test.com"
), (
    "parceiro 2",
    "5jNJIzhpDrYyxsPzS0Wvfwzx4e6Awr4+E35610gU4RLHoQSkfEXWVD5CK3DQfxBu3NwEjMsSwVidySHTK0hitvi/Cr7pkAy+AfAalE6wVJXlu6zZkBv9Eg/vIlAycVJr2zN4",
    "parceiro2@test.com"
);

INSERT INTO Addresses (
    state,
    city,
    street,
    postal_code,
    country,
    user_id
) VALUES (
    "estado",
    "cidade",
    "rua",
    123,
    "país",
    2
);

INSERT INTO Students (
    user_id,
    rg,
    school,
    course,
    address_id
) VALUES (
    2,
    1,
    "escola",
    "curso",
    1
), (
    4,
    2,
    "escola",
    "curso",
    1
);

INSERT INTO Partners (
    user_id,
    sector
) VALUES (
    3,
    "exatas"
), (
    5,
    "humanas"
);

INSERT INTO Teachers (
    user_id,
    cpf,
    department
) VALUES (
    1,
    321,
    "Ciências Exatas"
);

INSERT INTO Transactions (
    type,
    value,
    description,
    origin,
    target
) VALUES (
    "credit",
    1000,
    "Valor inicial",
    1,
    1
);
