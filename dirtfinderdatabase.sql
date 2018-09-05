DROP TABLE IF EXISTS userinfo;
CREATE TABLE userinfo (
  personid SERIAL PRIMARY KEY,
  username VARCHAR(255),
  siteaddress VARCHAR(255),
  sitecity VARCHAR(255),
  sitezipcode BIGINT,
  sitephone BIGINT,
  haveneed VARCHAR(10),
  soiltype VARCHAR(15)
);