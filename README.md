# worldbank-db-app
A simple csv uploader, database schema, and web app for displaying World Bank indicator data. 

# How to run
- run schema.sql in MySQL
- run node makedb.js 
- run node server.js, and go to localhost 8080

# Usage
- User can search for and select indicators with mouseclicks
- Can also use the search bar for codes or names and previously selected codes will stay selected. 
- When all indicators are selected, the user can pick their years and click the "Find Data" button.

- The table is scrollable for both x & y axes.
- Hit reset for another query
