CREATE database worldbank_db_test;

USE worldbank_db_test;

CREATE TABLE indicator (
	id int not null auto_increment,
	name varchar(150) not null, 
	code varchar(35) not null,
	primary key (id)
);

CREATE TABLE indicator_value (
	indicator_id int not null, 
	year int not null,
	value real,
	primary key (indicator_id, year)
);