# Dirt-Finder
## Table of Contents
* [Basic Problem Domain](### Basic Problem Domain)
* [Welcome Screen](### Welcome)
* [Have Dirt/Need Dirt](### Have/Need Page)
* [Map Page](### Map Page)
* [About Page](### About Page)
* [Initial Data Required](### Initial Data Required)

### Basic Problem Domain
* Create a database that stores jobsites that have or need dirt
  * User Creation Form
   * Form validation to ensure that required data input is entered.
   * When User Creation Form is Submitted a new location is added to the database.
  * Twilio
    * When user texts zipcode to 206-203-6412 they will receive a text response of all of the sites in the area that have or need dirt.
    * When user texts zipcode soiltype (structural) to 206-203-6412 they will receive a text response of all of the sites in the area that have or need dirt.
  * Map Page
    * When loaded renders stored pin data.

### Home
* Home screen brief intro to problem domain. 
* Map showing current existing pins.
* Have Dirt/Need Dirt Button that takes user to [Have Dirt/Need Dirt](### Have/Need Page).

### Have/Need Page
* User Creation Form Elements
  * Name
  * Phone Number
  * Street Address
  * City
  * Zipcode
  * Phone Number
* New Account Form Workflow
  * Requirements:
    * User must input:
      * Name
      * Phone Number
      * Street Address
      * City
      * Zipcode
      * Phone Number
    * Submit Button
      * When pressed User Data is stored in Heroku database and the user is taken back to the home page.
      * Takes user to [Home](### Home)

### Map Page
* Map showing current existing pins.
* Legend
  * Red Pins = Have Dirt
  * Green Pins = Need Dirt
* Have Dirt/Need Dirt Button that takes user to [Have Dirt/Need Dirt](### Have/Need Page).

### About Page
* About Page Elements
  * Daniel
  * Jason
  * Trevor
  * Kris
* About Page Workflow
  * Each person has a photo and bio.

### Initial Data Required
* 5 user to demonstate login capabilities for presentation.
