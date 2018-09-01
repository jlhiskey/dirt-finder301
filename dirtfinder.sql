DROP TABLE IF EXISTS userinfo;
CREATE TABLE userinfo (
  PersonId SERIAL PRIMARY KEY,
  FirstName VARCHAR(255),
  LastName VARCHAR(255),
  UserName VARCHAR(255),
  Phone VARCHAR(10),
  SiteName VARCHAR(255),
  SiteAddress VARCHAR(255),
  SitePhone VARCHAR(10),
  SiteContact VARCHAR(255),
  HaveNeed VARCHAR(2),
  DirtVolume INT,
  SiteDirtCategory VARCHAR(255)
);