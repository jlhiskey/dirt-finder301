DROP TABLE IF EXISTS userinfo;
CREATE TABLE userinfo (
  PersonId SERIAL PRIMARY KEY,
  UserName VARCHAR(255),
  SiteAddress VARCHAR(255),
  SiteCity VARCHAR(255),
  SiteZipcode INT,
  HaveNeed VARCHAR(10)
);