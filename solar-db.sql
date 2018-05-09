CREATE DATABASE  IF NOT EXISTS `solar` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `solar`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: 192.168.3.99    Database: solar
-- ------------------------------------------------------
-- Server version	5.6.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calendarevent`
--

DROP TABLE IF EXISTS `calendarevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendarevent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `properties` varchar(255) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `event_type` varchar(255) DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `title` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendarevent`
--

LOCK TABLES `calendarevent` WRITE;
/*!40000 ALTER TABLE `calendarevent` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendarevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationevent`
--

DROP TABLE IF EXISTS `notificationevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificationevent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime DEFAULT NULL,
  `notification_context` longtext,
  `read_status` int(11) DEFAULT NULL,
  `serviceevent` bigint(20) DEFAULT NULL,
  `user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs1e0kqhp7uvl40vobalo8ji37` (`serviceevent`),
  KEY `FKrn0rx91xj3uko802d37w21xhj` (`user`),
  CONSTRAINT `FKrn0rx91xj3uko802d37w21xhj` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  CONSTRAINT `FKs1e0kqhp7uvl40vobalo8ji37` FOREIGN KEY (`serviceevent`) REFERENCES `serviceevent` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationevent`
--

LOCK TABLES `notificationevent` WRITE;
/*!40000 ALTER TABLE `notificationevent` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificationevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationeventsettings`
--

DROP TABLE IF EXISTS `notificationeventsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificationeventsettings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` bit(1) DEFAULT NULL,
  `notification_center` bit(1) DEFAULT NULL,
  `sms` bit(1) DEFAULT NULL,
  `email_template` bigint(20) DEFAULT NULL,
  `notification_template` bigint(20) DEFAULT NULL,
  `phone_template` bigint(20) DEFAULT NULL,
  `serviceevent` bigint(20) DEFAULT NULL,
  `user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbg1fm2qo1ylgnafawbpovfk66` (`email_template`),
  KEY `FK6antl303go7anag8vkn39je4m` (`notification_template`),
  KEY `FKcbqhxooeu1l7rhfatxoc4tdhh` (`phone_template`),
  KEY `FK5dmgdq95m61c7w719couwadux` (`serviceevent`),
  KEY `FK2fal8535svjof9t8qy1pfqrom` (`user`),
  CONSTRAINT `FK2fal8535svjof9t8qy1pfqrom` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  CONSTRAINT `FK5dmgdq95m61c7w719couwadux` FOREIGN KEY (`serviceevent`) REFERENCES `serviceevent` (`id`),
  CONSTRAINT `FK6antl303go7anag8vkn39je4m` FOREIGN KEY (`notification_template`) REFERENCES `template` (`id`),
  CONSTRAINT `FKbg1fm2qo1ylgnafawbpovfk66` FOREIGN KEY (`email_template`) REFERENCES `template` (`id`),
  CONSTRAINT `FKcbqhxooeu1l7rhfatxoc4tdhh` FOREIGN KEY (`phone_template`) REFERENCES `template` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationeventsettings`
--

LOCK TABLES `notificationeventsettings` WRITE;
/*!40000 ALTER TABLE `notificationeventsettings` DISABLE KEYS */;
INSERT INTO `notificationeventsettings` VALUES (1,'','','\0',1,2,NULL,1,NULL),(2,'','','\0',3,4,NULL,2,NULL),(3,'','','\0',1,1,NULL,3,NULL);
/*!40000 ALTER TABLE `notificationeventsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` int(11) DEFAULT NULL,
  `expiry_time` datetime DEFAULT NULL,
  `user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjj7ompqdccw8u417109ip4b71` (`user`),
  CONSTRAINT `FKjj7ompqdccw8u417109ip4b71` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ADMIN');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceevent`
--

DROP TABLE IF EXISTS `serviceevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `serviceevent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_hvd5u9gyqwqhttrbgmltn426h` (`code`),
  UNIQUE KEY `UK_srpil16ehf81c7gm7x6dqmi0k` (`event`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceevent`
--

LOCK TABLES `serviceevent` WRITE;
/*!40000 ALTER TABLE `serviceevent` DISABLE KEYS */;
INSERT INTO `serviceevent` VALUES (1,'500','Sending OTP to user','UserService'),(2,'901','Error','UserService'),(3,'405','Calendar Event','CalendarService');
/*!40000 ALTER TABLE `serviceevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `name` varchar(25) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
INSERT INTO `template` VALUES (1,'OTP to change your password is ${OTP}','sendOtp',0),(2,'Websocket OTP to change your password is ${OTP}','WebsendOtp',2),(3,'Error occured at ${error}','sendError',0),(4,'Websocket Error occured at ${error}','WebsocketsendError',2),(5,'your event ${name} at $T{yyyyMMdd}','calendarEvent',2);
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'','smotaparthy@metanoiasolutions.net','smotaparthy','$2a$04$FWvSUewdu7n9v1ZUvc3.U.P37j36HtgRiPoJbM1PaLdCWGS2lpsjS','8096861024');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrole`
--

DROP TABLE IF EXISTS `userrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userrole` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKf9a7cojfuvf40x6co16kxa1jb` (`role_id`),
  CONSTRAINT `FKf9a7cojfuvf40x6co16kxa1jb` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FKtbick5dbrpnos6ll2175dt5qr` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrole`
--

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;
INSERT INTO `userrole` VALUES (1,1);
/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `widget`
--

DROP TABLE IF EXISTS `widget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_4epb6m2lav5g7x3s8t0uqdovn` (`name`),
  KEY `FKqeb7olychsfaffea7qy5fhqb4` (`role`),
  CONSTRAINT `FKqeb7olychsfaffea7qy5fhqb4` FOREIGN KEY (`role`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widget`
--

LOCK TABLES `widget` WRITE;
/*!40000 ALTER TABLE `widget` DISABLE KEYS */;
/*!40000 ALTER TABLE `widget` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-08-09 17:23:49
