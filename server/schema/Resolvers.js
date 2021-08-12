const { ApolloError, ValidationError, gql } = require('apollo-server-express')
const { GraphQLScalarType } = require('graphql');
const { v4: uuidv4 } = require('uuid');
const state = require('../state');

// Create a new numerical ID
const ID = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports = {
    Query: {
        games() {
            const games = Object.values(state.games)
            return games
        }
    },
    Mutation: {
        createGame(_, args) {
            // Create a new game object, spread args into it, and add a UUID and timestamp
            const game = {
                ...args,
                gameID: ID(),
                ownerSession: uuidv4(),
                createdAt: new Date(),
                players: [],
                active: false
            }

            state.games[game.gameID] = game
            state.sessions[game.ownerSession] = game.gameID

            return {
                session: game.ownerSession,
                game: game
            }
        },
        setGameStatus(_, args) {
            // Check if the session is valid
            if (state.sessions[args.session] == undefined) {
                throw new ApolloError(new Error('Invalid session'))
            }

            const game = state.games[state.sessions[args.session]]
            const active = args.active
            game.active = active
            return game
        },
        joinGame(_, args) {
            const { gameID, name } = args

            // If the name contains any characters that aren't in the alphabet, throw an error
            if (!name.match(/^[a-zA-Z ,.'-]+$/i)) {
                throw new ValidationError('Name is invalid')
            }
            // If the name is too long, throw an error
            if (name.length > 15) {
                throw new ValidationError('Name must be 15 characters or less')
            }
            // If the name is too short, throw an error
            if (name.length < 3) {
                throw new ValidationError('Name must be 3 characters or more')
            }


            // Check if a game with the uuid exists
            if (state.games[gameID] == undefined) {
                throw new ApolloError(new Error('Invalid game'))
            }

            const game = state.games[gameID]
            const player = {
                name: name,
                session: uuidv4()
            }

            // Add the player to the game
            game.players.push(player)
            return { session: player.session, game: game }
        }
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        parseValue(value) {
            return new Date(value)
        },
        serialize(value) {
            return value.toISOString()
        },
    })
}