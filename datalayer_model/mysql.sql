CREATE TABLE IF NOT EXISTS users (
    id int NOT NULL AUTO_INCREMENT,
	token varchar(50) NOT NULL,
	name varchar(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (token)
);

CREATE TABLE IF NOT EXISTS reminders (
    id int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    completed BOOLEAN DEFAULT 0,
    due DATETIME,
    owner varchar(50),
    PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES users(token)
);
