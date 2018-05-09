DROP table notificationevent;

CREATE TABLE `notificationevent` (
 `id` bigint(20) NOT NULL AUTO_INCREMENT,
 `last_update_time` datetime DEFAULT NULL,
 `notification_context` longtext,
 `read_status` int(11) DEFAULT NULL,
 `serviceevent` bigint(20) DEFAULT NULL,
 `user` bigint(20) DEFAULT NULL,
 `type` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `FKs1e0kqhp7uvl40vobalo8ji37` (`serviceevent`),
 KEY `FKrn0rx91xj3uko802d37w21xhj` (`user`),
 CONSTRAINT `FKrn0rx91xj3uko802d37w21xhj` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
 CONSTRAINT `FKs1e0kqhp7uvl40vobalo8ji37` FOREIGN KEY (`serviceevent`) REFERENCES `serviceevent` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=480 DEFAULT CHARSET=utf8;