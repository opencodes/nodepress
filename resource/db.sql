DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `category`;
/* User info */
CREATE TABLE `user` (id INT NOT NULL AUTO_INCREMENT,
		   `email_id` VARCHAR(255),
		   `password` VARCHAR(255),
		   `first_name` VARCHAR(200),
		   `last_name`  VARCHAR(255),
		   `nickname` VARCHAR(255),
  		   `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `nodepress`.`user` (`id`, `email_id`, `password`, `first_name`, `last_name`, `nickname`, `created_date`) VALUES (NULL, 'admin@nodepress.com', 'admin123', 'Admin', NULL, 'admin', CURRENT_TIMESTAMP);
/*Post Category*/
CREATE TABLE `category` (`id` INT NOT NULL AUTO_INCREMENT,
		   `cat_name` VARCHAR(255),
		   `description` text,
  		   `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   PRIMARY KEY (`id`)
) ENGINE=InnoDB;
INSERT INTO `nodepress`.`category` (`id`, `cat_name`, `description`, `created_date`) VALUES (NULL, 'Uncategorised', NULL, CURRENT_TIMESTAMP);
/*Post */
CREATE TABLE `post`(`id` INT NOT NULL AUTO_INCREMENT,
		   `title` text,
		   `content` text,
		   `image` text, 
		   `category_id` mediumint(10) REFERENCES category(id) ON DELETE CASCADE,
		   `posted_by` mediumint(10),
  		   `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		   PRIMARY KEY (`id`)                  
)ENGINE=INNODB;
INSERT INTO `nodepress`.`post` (`id`, `title`, `content`, `image`, `category_id`, `posted_by`, `created_date`) VALUES (NULL, 'Hello World', 'Hello World', NULL, '1', '1', CURRENT_TIMESTAMP);

/*Comments */
CREATE TABLE `comment`(`id` INT NOT NULL AUTO_INCREMENT,
		   `comment` text,
		   `post_id` mediumint(10) REFERENCES category(id) ON DELETE CASCADE,
		   `posted_by` mediumint(10) REFERENCES user(id) ON DELETE CASCADE,
  		   `comment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		   PRIMARY KEY (`id`)                  
)ENGINE=INNODB;
INSERT INTO `nodepress`.`comment` (`id`, `comment`, `post_id`, `posted_by`, `comment_date`) VALUES (NULL, 'Hello World', '1', '1', CURRENT_TIMESTAMP);
