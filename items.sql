CREATE TABLE `items` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`fullname` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`item` VARCHAR(255) NOT NULL,
	`quantity` INT(11) NOT NULL,
	`total_price` INT(11) NOT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=31
;
