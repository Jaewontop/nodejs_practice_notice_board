CREATE SCHEMA IF NOT EXISTS test;
use test;
-- CREATE USER 'test'@'localhost' identified with mysql_native_password by 'test';
-- GRANT ALL PRIVILEGES ON test.* TO 'test'@'localhost';
-- flush privileges;

CREATE TABLE IF NOT EXISTS `test`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` VARCHAR(50) NULL,
  `content` VARCHAR(50) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SELECT * from user;
DELETE FROM user WHERE id=null;
