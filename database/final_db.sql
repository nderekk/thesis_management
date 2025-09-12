-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: diplomatiki_sys
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `announcement_datetime` datetime NOT NULL,
  `announcement_content` text,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,9,'2025-09-05 11:19:43','ιδου μια ανακοινωση #1'),(3,1,'2025-09-05 12:10:43','ιδου μια ανακοινωση #2'),(4,25,'2025-09-05 13:09:43','ιδου μια ανακοινωση #3'),(5,26,'2025-09-05 13:19:43','ιδου μια ανακοινωση #4'),(6,27,'2025-09-05 15:12:43','ιδου μια ανακοινωση #5');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `token_idx` (`token`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklist`
--

LOCK TABLES `blacklist` WRITE;
/*!40000 ALTER TABLE `blacklist` DISABLE KEYS */;
INSERT INTO `blacklist` VALUES (14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6Im1wYXBhZG9AY2VpZC51cGF0cmFzLmdyIiwiaWQiOjJ9LCJpYXQiOjE3NTcwODI5NDEsImV4cCI6MTc1NzExODk0MX0.d26cg9yBPDwDWU731kgMC7zNu6ff-RNd8tUxxzU_j-E'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6Im1wYXBhZG9AY2VpZC51cGF0cmFzLmdyIiwiaWQiOjJ9LCJpYXQiOjE3NTcwODQ1MDAsImV4cCI6MTc1NzEyMDUwMH0.VZaqtiuVbrmI-pY2g_ef-qbGv94FyrmH9vHTgRNZnDI'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImluaWtvbGFvdUBjZWlkLnVwYXRyYXMuZ3IiLCJpZCI6M30sImlhdCI6MTc1NzA4MjYyNCwiZXhwIjoxNzU3MTE4NjI0fQ.RdMXQfUVO1sCvrp8rlqFuBfQqgmtSUXacClFvrmw2Ws'),(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImluaWtvbGFvdUBjZWlkLnVwYXRyYXMuZ3IiLCJpZCI6M30sImlhdCI6MTc1NzE4MTI3NywiZXhwIjoxNzU3MjE3Mjc3fQ.p373pKVeE-jsXOZQcZMiv7pTU99z2-pBbFgBpbJgvao'),(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImluaWtvbGFvdUBjZWlkLnVwYXRyYXMuZ3IiLCJpZCI6M30sImlhdCI6MTc1NzM0Nzk5MywiZXhwIjoxNzU3MzgzOTkzfQ.20q83gTpVTBc4w44Y2ZFgnmGopQXtaLqbqoMOt0UPGs'),(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImluaWtvbGFvdUBjZWlkLnVwYXRyYXMuZ3IiLCJpZCI6M30sImlhdCI6MTc1NzU5ODE1OSwiZXhwIjoxNzU3NjM0MTU5fQ.E9q6tMmnZGkqURWofMmAXZ0L7H3xv2aGNIL5glh7rbQ'),(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImluaWtvbGFvdUBjZWlkLnVwYXRyYXMuZ3IiLCJpZCI6M30sImlhdCI6MTc1NzU5ODEwNiwiZXhwIjoxNzU3NjM0MTA2fQ.SxUCryR8Z6Xl4ZBk1i7b3t4JCUNCA0Kp1HoSF2rlo6w'),(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImluaWtvbGFvdUBjZWlkLnVwYXRyYXMuZ3IiLCJpZCI6M30sImlhdCI6MTc1NzY2OTUyNSwiZXhwIjoxNzU3NzA1NTI1fQ.elIjaUc9fr6TMMJQJVD_k-mMZH5M3a-77zA1PfiZ_nI'),(1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDc2Nzg3LCJleHAiOjE3NTcxMTI3ODd9.kQ16EFd_E3PYJj6Zk0eQHa_PFUZvprC05E3L1YFfJUQ'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDg0NDIzLCJleHAiOjE3NTcxMjA0MjN9.nl09HJ_FcS1HQ5z8y_9dr4JlD4Y9TABwmHrAd0vw4hM'),(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDg2NjI3LCJleHAiOjE3NTcxMjI2Mjd9.PNAKUyghH2XwW10xXsV1Dq0LEkxyymFvOvRpXPql2is'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDgxOTU3LCJleHAiOjE3NTcxMTc5NTd9.Znflq9an-E9WCHMweLbFGVgMqTM6f7CHuUzIo0nIBcM'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDgyMDQ2LCJleHAiOjE3NTcxMTgwNDZ9.se0Jnsw0J6wQpHsRmKaRLb3ldFXqhpW2cDUuwsbGGts'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDgyNDg2LCJleHAiOjE3NTcxMTg0ODZ9.EOy8nGyTyXrZjd-_nx65bXrYQg6z9pIcmzLeIi5bLuo'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDgyNTQxLCJleHAiOjE3NTcxMTg1NDF9.nAcWpvlnujwTtiBi2p_SelKittWb5TYv9Pvkygmcelg'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MDgzMjQyLCJleHAiOjE3NTcxMTkyNDJ9.8_eZ12Q2QWHcVeajC_FqsocnBVHpNwdcVTOl2sdQqv8'),(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3MTc1NzA0LCJleHAiOjE3NTcyMTE3MDR9.CbGUrdZFKFYYBQk8XxMnHZfoEog_4VVcpGqHy0Tr0DM'),(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6ImRrb2xsaWFzQGNlaWQudXBhdHJhcy5nciIsImlkIjoxfSwiaWF0IjoxNzU3NjY5Njk5LCJleHAiOjE3NTc3MDU2OTl9.KzsKAxFiwaPAwauXaaQ91FxyeQychKuu14TpcTRNC6g'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDg0NTExLCJleHAiOjE3NTcxMjA1MTF9.yUwJx_5M5LV4TnqkXLZ0tX5xjz1FeBJ9hPKv_oBIw2s'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDg0NTg4LCJleHAiOjE3NTcxMjA1ODh9.s1Dc1NE78Aq1GJKJIKzeuywkzbSKzRQBwVt5nkBsQzY'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDg1NTUzLCJleHAiOjE3NTcxMjE1NTN9.j9mmuL68jOIk8UNmcM60Ee_9gDOTq9aZEDO3hjK9mQ0'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDg1OTAzLCJleHAiOjE3NTcxMjE5MDN9.xbzf6cyAqgmhucGLGGwB7b7xPZ0AC44giZxXwwJLoIE'),(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDg2NDI1LCJleHAiOjE3NTcxMjI0MjV9.8inoQ_mYE-ZYYzcvP9MfCzTOlKL6HOFBvdWrSdFqsuQ'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDgwNzEwLCJleHAiOjE3NTcxMTY3MTB9.lI-rUANzBXuhUVVQk3BvOLHHYMP9zZpjWtWBDzNygA8'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDgxOTc2LCJleHAiOjE3NTcxMTc5NzZ9.-d_CO17G0JnXA7UTRmZE4X5RiLS7jnDoAwOtDPvgG2g'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDgyMTM3LCJleHAiOjE3NTcxMTgxMzd9.zCoJ9ACm6A--lxMflItWS18IV2_oMyghD68CbRgKSoE'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDgzMDg0LCJleHAiOjE3NTcxMTkwODR9.-7jvuz5jcRCH6R8Q5EfFwo4oHUha9PoCtj1v1ycN2mk'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3MDgzMjY4LCJleHAiOjE3NTcxMTkyNjh9.s7gT2p0E_6JOxNiJ6qT6NNRCco9GmZ4RE9mM6YFiMM8'),(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InBrYXRzQGNlaWQudXBhdHJhcy5nciIsImlkIjo1fSwiaWF0IjoxNzU3NjcwMDYwLCJleHAiOjE3NTc3MDYwNjB9.bHRcMWHkXyR-8V__EahThL_oxFXNOC8fIbbQNLd_CAk'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJhbmRwZXRAdXBhdHJhcy5nciIsImlkIjo2fSwiaWF0IjoxNzU3MDgwNTMwLCJleHAiOjE3NTcxMTY1MzB9.9s1GVFd86MCLoymqYmQZLtO-Npj8FwjFG54CQB_lBiI'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJhbmRwZXRAdXBhdHJhcy5nciIsImlkIjo2fSwiaWF0IjoxNzU3MDgyNTY2LCJleHAiOjE3NTcxMTg1NjZ9.ifdSiB9qomeLVBby5ixwP0i5xWgiDk2gEtMISp0ckq0'),(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJhbmRwZXRAdXBhdHJhcy5nciIsImlkIjo2fSwiaWF0IjoxNzU3MTc0Mjc1LCJleHAiOjE3NTcyMTAyNzV9.u8Dyk_gIXKI4b61iRxnj7mPy8iT17u4k4GoxNwJ8sJc'),(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJhbmRwZXRAdXBhdHJhcy5nciIsImlkIjo2fSwiaWF0IjoxNzU3NTk4MDcyLCJleHAiOjE3NTc2MzQwNzJ9.9he_fAC4dY9c_X3L4rDd8NgdTcWA0Nxod6NCi5NKY9k'),(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJlbG1ha3JpQHVwYXRyYXMuZ3IiLCJpZCI6N30sImlhdCI6MTc1NzE4MTI3MywiZXhwIjoxNzU3MjE3MjczfQ.IvuLF5rhDVCsvE04WAbYny5OgII-IXOreP0CI2btDW8'),(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJlbG1ha3JpQHVwYXRyYXMuZ3IiLCJpZCI6N30sImlhdCI6MTc1NzExMTUwNCwiZXhwIjoxNzU3MTQ3NTA0fQ.sVkDIcRXhM3fDDb9SzVyH3wrq5psZf9VZCWvugd9XbU'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJnaW9rYXlAdXBhdHJhcy5nciIsImlkIjoxMX0sImlhdCI6MTc1NzA4MDY3NCwiZXhwIjoxNzU3MTE2Njc0fQ.trE3XuHrTyC_7rcImdp1qcDlCz-3Jl9ndmnRI0h1eRc'),(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJnaW9rYXlAdXBhdHJhcy5nciIsImlkIjoxMX0sImlhdCI6MTc1NzA4Mjk1MiwiZXhwIjoxNzU3MTE4OTUyfQ.5J-Jz593pPvPe45mb7siaNCIOJxQH_ZOGR0YyURHWso'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJnaW9rYXlAdXBhdHJhcy5nciIsImlkIjoxMX0sImlhdCI6MTc1NzA4MjYxNCwiZXhwIjoxNzU3MTE4NjE0fQ.YGR8IlKV0RS8-muyIKIl2WXFaOQ2L9moJm5GRB6Qrm0'),(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJnaW9rYXlAdXBhdHJhcy5nciIsImlkIjoxMX0sImlhdCI6MTc1NzE3NDI5MCwiZXhwIjoxNzU3MjEwMjkwfQ.IEJGD9bIQkcIEGeTPaRqq0wEvFftZ_k2M_1VhaqWtlc'),(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJtcGFtcGlzQHVwYXRyYXMuZ3IiLCJpZCI6OX0sImlhdCI6MTc1NzExMTQ5OCwiZXhwIjoxNzU3MTQ3NDk4fQ.jUaApByNkf5ly5W6jKAQMRgTlnYz9FgxZgARxJX_M-s'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzZWNyZXRhcnkiLCJlbWFpbCI6ImdzcGFub3VAY2VpZC51cGF0cmFzLmdyIiwiaWQiOjE2fSwiaWF0IjoxNzU3MDg0NjM2LCJleHAiOjE3NTcxMjA2MzZ9.NipjgHoayw9a3P4MNc87aOhrqRzWvXH2IGONeQAI4oc'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzZWNyZXRhcnkiLCJlbWFpbCI6ImdzcGFub3VAY2VpZC51cGF0cmFzLmdyIiwiaWQiOjE2fSwiaWF0IjoxNzU3MDg1OTEyLCJleHAiOjE3NTcxMjE5MTJ9.E-uFGPNwB5DzXApvjYzRozGtfzzBROcgMOdU7hFslws'),(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzZWNyZXRhcnkiLCJlbWFpbCI6ImdzcGFub3VAY2VpZC51cGF0cmFzLmdyIiwiaWQiOjE2fSwiaWF0IjoxNzU3MTEwMjQ2LCJleHAiOjE3NTcxNDYyNDZ9.frNa7DOHsFPhwQNt1yjvwwWXDg8Met802dlZiovKfkM'),(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzZWNyZXRhcnkiLCJlbWFpbCI6ImdzcGFub3VAY2VpZC51cGF0cmFzLmdyIiwiaWQiOjE2fSwiaWF0IjoxNzU3NjcwMjE1LCJleHAiOjE3NTc3MDYyMTV9.Nwz-6-JZ6XMPceRTmUyZ5y549uSf4gvQzqicyux0DVs');
/*!40000 ALTER TABLE `blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  CONSTRAINT `links_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `links`
--

LOCK TABLES `links` WRITE;
/*!40000 ALTER TABLE `links` DISABLE KEYS */;
INSERT INTO `links` VALUES (1,9,'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&ab_channel=RickAstley'),(2,9,'google.com');
/*!40000 ALTER TABLE `links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `am` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `field_of_expertise` varchar(150) NOT NULL,
  `prof_userid` int NOT NULL,
  PRIMARY KEY (`am`),
  KEY `prof_userid` (`prof_userid`),
  CONSTRAINT `professor_ibfk_1` FOREIGN KEY (`prof_userid`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,'Dimitris','Kollias','dkollias@ceid.upatras.gr','2610960001','Computer Architecture',1),(2,'Maria','Papadopoulou','mpapado@ceid.upatras.gr','2610960002','Machine Learning',2),(3,'Ilias','Nikolaou','inikolaou@ceid.upatras.gr','2610960003','Cybersecurity',3),(4,'Spiros','Maskoulis','smasko@ceid.upatras.gr','2650960001','Theoritical Computer Science',4),(5,'Prodromos','Katsikis','pkats@ceid.upatras.gr','2660960001','Artificial Intelligence',5);
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secretary`
--

DROP TABLE IF EXISTS `secretary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `secretary` (
  `am` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `secretary_userid` int NOT NULL,
  PRIMARY KEY (`am`),
  KEY `secretary_userid` (`secretary_userid`),
  CONSTRAINT `secretary_ibfk_1` FOREIGN KEY (`secretary_userid`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secretary`
--

LOCK TABLES `secretary` WRITE;
/*!40000 ALTER TABLE `secretary` DISABLE KEYS */;
INSERT INTO `secretary` VALUES (1,'Georgia','Spanou','2610960010','Λεωφ. Γούναρη 85','gspanou@ceid.upatras.gr',16),(2,'Katerina','Vlachou','2610960011','Οδός Αγ. Ανδρέα 30','kvlachou@ceid.upatras.gr',17);
/*!40000 ALTER TABLE `secretary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `am` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `father_name` varchar(50) NOT NULL,
  `semester` smallint DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `mobile_number` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(30) NOT NULL,
  `post_code` int NOT NULL,
  `student_userid` int NOT NULL,
  PRIMARY KEY (`am`),
  KEY `student_userid` (`student_userid`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`student_userid`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'Andreas','Petrou','Giorgos',8,'andpet@upatras.gr','2610991101','6944111111','Οδός Παπαδιαμάντη 12','Patras',26223,6),(2,'Eleni','Makri','Nikos',7,'elmakri@upatras.gr','2610991234','6944222222','Οδός Καποδιστρίου 25','Patras',26224,7),(3,'Mpampis','Kuriakos','Nikos',7,'mpampis@upatras.gr','2610994312','6944222444','Οδός Βραχνονησίδας 21','Patras',26224,8),(4,'Nikos','Charalampous','Dimitris',9,'nikchar@upatras.gr','2610995678','6944333333','Οδός Ερμού 88','Patras',26225,9),(5,'Kostis','Lamprou','Iosif',9,'klamprou@upatras.gr','2610990968','6944222555','Οδός Ηρακλείτου 18','Patras',26223,10),(6,'Giorgos','Kay','Giorgos',8,'giokay@upatras.gr','2610996425','6944111666','Κανακαρη 12','Patras',26223,11),(7,'Sotiris','Snikopoulos','Nikos',7,'snik@upatras.gr','2610991562','6944222777','Βονίτσης 112','Αθηνα',26224,12),(8,'Giannis','Damianidis','Orsalios',7,'light@upatras.gr','2610995666','6944222888','Οδός Αμπελοκηπως 12','Patras',26224,13),(9,'Iraklis','Ivanidis','Dimitris',9,'ivan@upatras.gr','2610991333','69443333999','Οδός Ερμού 2','Patras',26225,14),(10,'Damianos','Arabopoulos','Spiros',9,'arab@upatras.gr','2610992888','6944233333','Οδός Μενιδιου 18','Athens',26223,15);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `email_update` AFTER UPDATE ON `student` FOR EACH ROW BEGIN
UPDATE users SET email = new.email WHERE id = new.student_userid;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `thesis`
--

DROP TABLE IF EXISTS `thesis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `student_am` int NOT NULL,
  `supervisor_am` int NOT NULL,
  `prof2_am` int DEFAULT NULL,
  `prof3_am` int DEFAULT NULL,
  `thesis_status` enum('Pending','Active','Completed','Cancelled','Review') NOT NULL,
  `assignment_date` date DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `thesis_content_file` varchar(255) DEFAULT NULL,
  `thesis_content_filename` varchar(255) DEFAULT NULL,
  `nemertes_link` varchar(255) DEFAULT NULL,
  `ap_from_gs` int DEFAULT NULL,
  `enableGrading` tinyint(1) DEFAULT '0',
  `enableAnnounce` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `topic_id` (`topic_id`),
  KEY `topic_link` (`topic_id`) USING BTREE,
  KEY `student_link` (`student_am`) USING BTREE,
  KEY `supervisor_link` (`supervisor_am`) USING BTREE,
  KEY `prof2_link` (`prof2_am`) USING BTREE,
  KEY `prof3_link` (`prof3_am`) USING BTREE,
  CONSTRAINT `thesis_ibfk_261` FOREIGN KEY (`topic_id`) REFERENCES `thesis_topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_ibfk_262` FOREIGN KEY (`student_am`) REFERENCES `student` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_ibfk_263` FOREIGN KEY (`supervisor_am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_ibfk_264` FOREIGN KEY (`prof2_am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_ibfk_265` FOREIGN KEY (`prof3_am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis`
--

LOCK TABLES `thesis` WRITE;
/*!40000 ALTER TABLE `thesis` DISABLE KEYS */;
INSERT INTO `thesis` VALUES (1,1,1,1,2,3,'Completed','2025-01-15','2025-09-12','1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis1',1001,0,1),(2,2,2,2,1,3,'Review','2025-01-20',NULL,'1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis2',1002,0,0),(9,10,6,5,1,2,'Completed','2025-01-05','2025-09-12','1757175481835-951071766.pdf','ekatharistiko2021.pdf','link-gia-nimerti.gr',1004,1,1),(25,11,4,1,2,3,'Completed','2025-02-10','2025-09-12','1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis4',1004,0,1),(26,12,5,2,1,3,'Completed','2025-02-12','2025-09-12','1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis5',1005,0,1),(27,13,7,3,1,2,'Completed','2025-02-15','2025-09-12','1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis7',1007,0,1),(28,14,8,4,2,5,'Active','2025-02-20',NULL,'1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis8',1008,0,0),(29,15,9,5,3,4,'Cancelled','2025-02-25',NULL,'1757175481835-951071766.pdf','ekatharistiko2021.pdf','https://nemertes.upatras.gr/thesis9',1009,0,0);
/*!40000 ALTER TABLE `thesis` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `mark_completion_date` BEFORE UPDATE ON `thesis` FOR EACH ROW BEGIN
	IF new.thesis_status = "Completed" THEN 
		SET new.completion_date = CURDATE();
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `createThesisGrade` AFTER UPDATE ON `thesis` FOR EACH ROW BEGIN
	IF old.enableGrading = 0 AND new.enableGrading = 1 THEN
		INSERT INTO thesis_grade(thesis_id, prof1am , prof2am , prof3am) VALUES (new.id, new.supervisor_am, new.prof2_am, new.prof3_am);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `thesisLogs` AFTER UPDATE ON `thesis` FOR EACH ROW BEGIN
	IF new.thesis_status = 'Active' AND old.thesis_status = 'Pending' THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
    ELSEIF new.thesis_status = 'Review' AND old.thesis_status = 'Active' THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
	ELSEIF new.thesis_status = 'Completed' AND old.thesis_status = 'Review' THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
	ELSEIF new.thesis_status = 'Cancelled' AND (old.thesis_status = 'Pending' OR old.thesis_status = 'Active') THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `thesis_cancellation`
--

DROP TABLE IF EXISTS `thesis_cancellation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis_cancellation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `reason` enum('By Professor','By Secretary') NOT NULL,
  `reason_text` text,
  `assembly_year` int DEFAULT NULL,
  `assembly_number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  CONSTRAINT `thesis_cancellation_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis_cancellation`
--

LOCK TABLES `thesis_cancellation` WRITE;
/*!40000 ALTER TABLE `thesis_cancellation` DISABLE KEYS */;
INSERT INTO `thesis_cancellation` VALUES (3,29,'By Secretary','κατόπιν αίτησης Φοιτητή/τριας',2025,352);
/*!40000 ALTER TABLE `thesis_cancellation` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `cancelThesis` AFTER INSERT ON `thesis_cancellation` FOR EACH ROW BEGIN
	UPDATE thesis SET thesis.thesis_status = 'Cancelled' WHERE thesis.id = new.thesis_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `thesis_comments`
--

DROP TABLE IF EXISTS `thesis_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prof_am` int NOT NULL,
  `thesis_id` int NOT NULL,
  `comments` varchar(300) NOT NULL,
  `comment_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prof_am` (`prof_am`),
  KEY `thesis_id` (`thesis_id`),
  CONSTRAINT `thesis_comments_ibfk_105` FOREIGN KEY (`prof_am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_comments_ibfk_106` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis_comments`
--

LOCK TABLES `thesis_comments` WRITE;
/*!40000 ALTER TABLE `thesis_comments` DISABLE KEYS */;
INSERT INTO `thesis_comments` VALUES (1,5,9,'note 1','2025-09-05'),(2,1,9,'kollias 1','2025-09-05');
/*!40000 ALTER TABLE `thesis_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thesis_grade`
--

DROP TABLE IF EXISTS `thesis_grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis_grade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `final_grade` decimal(4,2) DEFAULT NULL,
  `prof1am` int DEFAULT NULL,
  `prof1_grade1` decimal(4,2) DEFAULT NULL,
  `prof1_grade2` decimal(4,2) DEFAULT NULL,
  `prof1_grade3` decimal(4,2) DEFAULT NULL,
  `prof1_grade4` decimal(4,2) DEFAULT NULL,
  `prof2am` int DEFAULT NULL,
  `prof2_grade1` decimal(4,2) DEFAULT NULL,
  `prof2_grade2` decimal(4,2) DEFAULT NULL,
  `prof2_grade3` decimal(4,2) DEFAULT NULL,
  `prof2_grade4` decimal(4,2) DEFAULT NULL,
  `prof3am` int DEFAULT NULL,
  `prof3_grade1` decimal(4,2) DEFAULT NULL,
  `prof3_grade2` decimal(4,2) DEFAULT NULL,
  `prof3_grade3` decimal(4,2) DEFAULT NULL,
  `prof3_grade4` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  KEY `prof1am` (`prof1am`),
  KEY `prof2am` (`prof2am`),
  KEY `prof3am` (`prof3am`),
  CONSTRAINT `thesis_grade_ibfk_209` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_grade_ibfk_210` FOREIGN KEY (`prof1am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_grade_ibfk_211` FOREIGN KEY (`prof2am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_grade_ibfk_212` FOREIGN KEY (`prof3am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis_grade`
--

LOCK TABLES `thesis_grade` WRITE;
/*!40000 ALTER TABLE `thesis_grade` DISABLE KEYS */;
INSERT INTO `thesis_grade` VALUES (1,1,9.00,1,10.00,10.00,10.00,10.00,2,9.00,9.00,9.00,9.00,3,8.00,8.00,8.00,8.00),(2,9,8.00,5,9.00,9.00,9.00,9.00,1,7.00,7.00,7.00,7.00,2,8.00,8.00,8.00,8.00),(6,25,8.67,1,9.00,9.00,9.00,9.00,2,8.00,8.00,8.00,8.00,3,9.00,9.00,9.00,9.00),(7,26,9.00,1,10.00,10.00,10.00,9.00,2,9.00,9.00,9.00,9.00,3,8.00,8.00,8.00,8.00),(8,27,7.33,1,7.00,7.00,7.00,7.00,2,8.00,8.00,8.00,8.00,3,7.00,7.00,7.00,7.00);
/*!40000 ALTER TABLE `thesis_grade` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `finalGrade` BEFORE UPDATE ON `thesis_grade` FOR EACH ROW BEGIN
	IF new.prof1_grade1 IS NOT NULL AND new.prof2_grade1 IS NOT NULL AND new.prof3_grade1 IS NOT NULL THEN
		SET new.final_grade = ((0.6*new.prof1_grade1 + 0.15*new.prof1_grade2 + 0.15*new.prof1_grade3 + 0.1*new.prof1_grade4) + 
        (0.6*new.prof2_grade1 + 0.15*new.prof2_grade2 + 0.15*new.prof2_grade3 + 0.1*new.prof2_grade4) + (0.6*new.prof3_grade1 + 0.15*new.prof3_grade2 + 0.15*new.prof3_grade3 + 0.1*new.prof3_grade4))/3;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `thesis_logs`
--

DROP TABLE IF EXISTS `thesis_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `timedate` datetime NOT NULL,
  `prev_status` enum('Pending','Review','Active','Completed','Cancelled') NOT NULL,
  `new_status` enum('Pending','Review','Active','Completed','Cancelled') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  CONSTRAINT `thesis_logs_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis_logs`
--

LOCK TABLES `thesis_logs` WRITE;
/*!40000 ALTER TABLE `thesis_logs` DISABLE KEYS */;
INSERT INTO `thesis_logs` VALUES (1,9,'2025-09-05 14:35:44','Pending','Active'),(2,9,'2025-09-05 14:41:11','Active','Review'),(3,9,'2025-09-05 15:28:18','Review','Completed'),(4,2,'2025-09-11 13:42:57','Active','Review'),(6,29,'2025-09-12 09:44:09','Active','Cancelled'),(7,28,'2025-09-12 09:46:10','Pending','Active'),(8,2,'2025-09-11 12:42:57','Pending','Active'),(10,1,'2025-04-12 08:41:09','Pending','Active'),(11,1,'2025-08-12 12:42:00','Active','Review'),(12,1,'2025-09-12 13:12:09','Review','Completed'),(13,25,'2025-02-20 12:42:00','Pending','Active'),(14,25,'2025-08-20 18:42:12','Active','Review'),(15,25,'2025-09-12 18:42:12','Review','Completed'),(16,26,'2025-02-25 14:35:44','Pending','Active'),(17,26,'2025-08-25 14:35:44','Active','Review'),(18,26,'2025-09-12 14:35:44','Review','Completed'),(19,27,'2025-02-21 18:11:11','Pending','Active'),(20,27,'2025-08-21 18:11:11','Active','Review'),(21,27,'2025-09-12 12:12:12','Review','Completed'),(22,29,'2025-09-03 02:12:02','Pending','Active');
/*!40000 ALTER TABLE `thesis_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thesis_presentation`
--

DROP TABLE IF EXISTS `thesis_presentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis_presentation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `date_time` datetime DEFAULT NULL,
  `presentation_type` enum('in-person','online') DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  CONSTRAINT `thesis_presentation_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis_presentation`
--

LOCK TABLES `thesis_presentation` WRITE;
/*!40000 ALTER TABLE `thesis_presentation` DISABLE KEYS */;
INSERT INTO `thesis_presentation` VALUES (1,1,'2025-05-05 00:00:00','in-person','αίθουσα Γ'),(2,9,'2025-09-06 09:12:00','in-person','Αιθουσα Γ'),(3,25,'2025-07-20 10:00:00','in-person','Αίθουσα 201'),(4,26,'2025-07-22 11:00:00','online','https://zoom.us/j/123456789'),(5,27,'2025-07-25 09:30:00','in-person','Αίθουσα 305');
/*!40000 ALTER TABLE `thesis_presentation` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `enableAnnouncements` AFTER INSERT ON `thesis_presentation` FOR EACH ROW BEGIN
	UPDATE thesis SET enableAnnounce = 1 WHERE new.thesis_id = id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `thesis_topics`
--

DROP TABLE IF EXISTS `thesis_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thesis_topics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prof_am` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `attached_discription_file` varchar(255) DEFAULT NULL,
  `original_file_name` varchar(255) DEFAULT NULL,
  `topic_status` enum('assigned','temp_assigned','unassigned') NOT NULL,
  `student_am` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prof_am` (`prof_am`),
  KEY `student_am` (`student_am`),
  CONSTRAINT `thesis_topics_ibfk_105` FOREIGN KEY (`prof_am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thesis_topics_ibfk_106` FOREIGN KEY (`student_am`) REFERENCES `student` (`am`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thesis_topics`
--

LOCK TABLES `thesis_topics` WRITE;
/*!40000 ALTER TABLE `thesis_topics` DISABLE KEYS */;
INSERT INTO `thesis_topics` VALUES (1,1,'RISC-V CPU','Designing a custom RISC-V CPU in Verilog','riscv_description.pdf',NULL,'assigned',1,'2025-01-15 00:00:00','2025-01-15 00:00:00'),(2,2,'AI Tutor','Creating an adaptive learning system using ML','ai_tutor_description.pdf',NULL,'assigned',2,'2025-01-15 00:00:00','2025-01-15 00:00:00'),(3,3,'Secure App','Developing a secure messaging app for Android','secure_app_description.pdf',NULL,'unassigned',NULL,'2025-01-15 00:00:00','2025-09-08 16:58:36'),(4,1,'FPGA Vision','Using FPGAs for real-time image processing','fpga_vision.pdf',NULL,'unassigned',NULL,'2025-01-15 00:00:00','2025-01-15 00:00:00'),(5,2,'ML Compiler','AutoML for optimizing compiler pipelines','ml_compiler.pdf',NULL,'unassigned',NULL,'2025-01-15 00:00:00','2025-01-15 00:00:00'),(6,4,'Cyber Security in Embedded Systems','lorem ipsum','1753440448217-668114698.pdf',NULL,'unassigned',NULL,'2025-07-25 00:00:00','2025-07-25 00:00:00'),(7,5,'Optimization Algorithms','so they can be very very fast','1757080730412-293617102.pdf','FrontistiriakesAskiseis.pdf','unassigned',NULL,'2025-01-15 00:00:00','2025-09-05 14:11:14'),(8,5,'Computer Vision','make computers see','1757080741201-757249074.pdf','InformationTheory.pdf','unassigned',NULL,'2025-07-25 00:00:00','2025-09-05 13:59:01'),(10,5,'ML in Agruculture','lorem ipsum','1757082270629-271521243.pdf','CA-1.pdf','assigned',6,'2025-09-05 14:24:30','2025-09-05 14:25:01'),(11,1,'Distributed Systems Optimization','Optimizing distributed consensus protocols','dist_sys.pdf',NULL,'assigned',4,'2025-02-01 00:00:00','2025-02-01 00:00:00'),(12,2,'Deep Reinforcement Learning','Exploring reinforcement learning for robotics','drl.pdf',NULL,'assigned',5,'2025-02-01 00:00:00','2025-02-01 00:00:00'),(13,3,'Blockchain Security','Analyzing vulnerabilities in blockchain protocols','blockchain_sec.pdf',NULL,'assigned',7,'2025-02-01 00:00:00','2025-02-01 00:00:00'),(14,4,'Graph Algorithms in Big Data','Scalable graph processing techniques','graph_bigdata.pdf',NULL,'assigned',8,'2025-02-01 00:00:00','2025-02-01 00:00:00'),(15,5,'Neural Machine Translation','Developing an NMT model for Greek-English translation','nmt.pdf',NULL,'assigned',9,'2025-02-01 00:00:00','2025-02-01 00:00:00');
/*!40000 ALTER TABLE `thesis_topics` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `delete_temp_thesis` BEFORE UPDATE ON `thesis_topics` FOR EACH ROW BEGIN
	IF new.topic_status = "unassigned" THEN 
		DELETE FROM thesis WHERE new.id = thesis.topic_Id;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_pending_thesis` AFTER UPDATE ON `thesis_topics` FOR EACH ROW BEGIN
	IF new.topic_status = "temp_assigned" THEN 
		INSERT INTO thesis (topic_id, student_am, supervisor_am, prof2_am, prof3_am, thesis_status, assignment_date) VALUES 
		(new.id, new.student_am, new.prof_am, null, null, 'Pending', CURDATE());
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `trimelis_requests`
--

DROP TABLE IF EXISTS `trimelis_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trimelis_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thesis_id` int NOT NULL,
  `prof_am` int NOT NULL,
  `answer` enum('pending','accepted','declined') NOT NULL,
  `invite_date` date NOT NULL,
  `answer_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `thesis_id` (`thesis_id`),
  KEY `prof_am` (`prof_am`),
  CONSTRAINT `trimelis_requests_ibfk_103` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trimelis_requests_ibfk_104` FOREIGN KEY (`prof_am`) REFERENCES `professor` (`am`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trimelis_requests`
--

LOCK TABLES `trimelis_requests` WRITE;
/*!40000 ALTER TABLE `trimelis_requests` DISABLE KEYS */;
INSERT INTO `trimelis_requests` VALUES (4,9,1,'accepted','2025-09-05','2025-09-05'),(5,9,2,'accepted','2025-09-05','2025-09-05'),(6,9,3,'declined','2025-09-05','2025-09-05');
/*!40000 ALTER TABLE `trimelis_requests` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_committee` AFTER UPDATE ON `trimelis_requests` FOR EACH ROW BEGIN

DECLARE current_prof2_am VARCHAR(255);
DECLARE topic INT;
 
IF new.answer = "accepted" THEN 
	 
    SELECT prof2_am, topic_id INTO current_prof2_am, topic
    FROM thesis
    WHERE id = NEW.thesis_id;
    
	IF current_prof2_am IS NULL THEN 
		UPDATE thesis SET thesis.prof2_am = new.prof_am WHERE thesis.id = new.thesis_id;
	ELSE
		UPDATE thesis SET thesis.prof3_am = new.prof_am WHERE thesis.id = new.thesis_id;
        UPDATE thesis SET thesis.thesis_status = 'Active' WHERE thesis.id = new.thesis_id;
        UPDATE thesis_topics SET thesis_topics.topic_status = 'assigned' WHERE thesis_topics.id = topic;
	END IF;
END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('professor','student','secretary') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dkollias@ceid.upatras.gr','hashed_password_1','professor'),(2,'mpapado@ceid.upatras.gr','hashed_password_2','professor'),(3,'inikolaou@ceid.upatras.gr','hashed_password_3','professor'),(4,'smasko@ceid.upatras.gr','hashed_password_11','professor'),(5,'pkats@ceid.upatras.gr','hashed_password_12','professor'),(6,'andpet@upatras.gr','hashed_password_4','student'),(7,'elmakri@upatras.gr','hashed_password_5','student'),(8,'nikchar@upatras.gr','hashed_password_6','student'),(9,'mpampis@upatras.gr','hashed_password_9','student'),(10,'klamprou@upatras.gr','hashed_password_10','student'),(11,'giokay@upatras.gr','123','student'),(12,'snik@upatras.gr','123','student'),(13,'light@upatras.gr','123','student'),(14,'ivan@upatras.gr','123','student'),(15,'arab@upatras.gr','123','student'),(16,'gspanou@ceid.upatras.gr','hashed_password_7','secretary'),(17,'kvlachou@ceid.upatras.gr','hashed_password_8','secretary');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-12 13:12:34
