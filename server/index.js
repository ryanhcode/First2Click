const { ApolloServer, ApolloError, ValidationError, gql } = require('apollo-server-express')
const express = require("express")

const app = express()

const typeDefs = require("./schema/TypeDefs")

// Resolvers for graphql
const resolvers = require("./schema/Resolvers")

const server = new ApolloServer({
    typeDefs,
    resolvers
})


server.start().then(() => {
    server.applyMiddleware({ app })

    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(`Server ready`)
    })
})