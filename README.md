# TypeSprint
By:

# Project Description
## Who is our target audience?

## Why does our audience want to use our application?


## Why do we as developers want to build this application?

# Technical Description

## Architectural Diagrams


## Data Flow


## Summary Tables for User Stories

| Priority | User | Description | Technical Implementation |
|----------|------|-------------|--------------------------|
| P0 | New Player | As a new user, I want to be able to join a game lobby and race the next person who joins the same lobby | RESI API with a POST /join endpoint + websockets to create a joinable game room |
| P0 | Player | As a player, I want to receive a random sentence to type when the game starts | Use a GET /sentences endpoint to retrieve a random sentence stored in MongoDB which is sent via WebSockets for all racers to type |
| P0 | Player | As a player, I want to know who won the race | Use WebSockets to determine when all users finish the race and display the results while also saving them in MongoDB |
| P0 | Player | As a player, I want to be able to log in | Use Azure for login service and authenticating users |
| P1 | Player | As a player, I want to be able to see various stats at the end of the race(wpm, time, accuracy, etc.) | Use WebSockets to determine race time of each user and calculate speed using the sentence length and racing time |
| P1 | New Player | As a new player, I want to be able to have a profile with personalized information(username, etc.) | Use Express sessions and Azure authentication to sign in and store user information like game history in MongoDB |
| P1 | Player | As a player, I want to see the real-time progress of other users during the race | Provide visual updates via WebSockets |
| P1 | Player | As a player, I want to see a global leaderboard of the fastest times | Store a list of the fastest racers in MongoDB and use a GET /globalleaderboard endpoint to fetch it |
| P1 | Returning Player | As a returning player, I want to be able to see my racing history | Use Express sessions and Azure authentication to sign in and store user information like game history in MongoDB |
| P2 | Spectating Player | As a spectating player, I want to watch live races without participating | WMake matches a spectacle in real time using WebSockets |
| P2 | Returning Player | As a returning player, I want to be able to choose who I race against | Use WebSockets to handle incoming connections and create UI to allow users to pick from available online users |

## API Endpoints:


## Database Schemas:

 
