const { gql } = require('apollo-server-express');

module.exports = gql `
    scalar Date

    "A player in a game"
    type Player {
        "Display name of the player"
        name: String!
    }

    "Response on the creation of a game"
    type GameCreation {
        "Session ID for the game owner"
        session: String!
        "The game that was just created"
        game: Game!
    }

    "Response on the joining of a game"
    type JoinResponse {
        "Session ID for the player"
        session: String!
        "The game that was joined"
        game: Game!
    }

    type Game {
        "User-defined name"
        name: String!
        "Unique identifier"
        gameID: String!
        "Time of creation"
        createdAt: Date!
        "If the game is paused/active"
        active: Boolean!
        "A list of players in the game"
        players: [Player!]!
    }

    type Query {
        "All currently active games"
        games: [Game!]!
    }

    type Mutation {
        "Create a new game"
        createGame(name: String!): GameCreation
        "Set the status of a game"
        setGameStatus(session: String!, active: Boolean!): Game
        "Reset game status"
        resetGameStatus(session: String!): Game
        "Join a game"
        joinGame(gameID: String!, name: String!): JoinResponse
    }
`