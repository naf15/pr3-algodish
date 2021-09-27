const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    created_dishes: [Dish]
    favorite_dishes: [Dish]
    history_dishes: [Dish]
  }

  type Dish {
    _id: ID
    title: String
    dishAuthor: String
    image: String
    ingredients: [String]
    instructions: Instructions!
  }

  type Instructions {
    _id: ID
    total_time: Int
    steps: [Step]
  }

  type Step {
    _id: ID
    time: Int
    step: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    userDishes(username: String!): [Dish]
    userHistory(username: String!): [Dish]
    userFavorites(username: String!): [Dish]
    allDishes: [Dish]
    dishesByName(title: String!): [Dish]
    dishById(_id: ID!): Dish
    fiveRandomDishes: [Dish]
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    uploadDish(title: String!, image: String!, ingredients: [String]!): Dish
    addInstructions(dishId: ID!): Dish
    addStep(instructionId: ID!, time:Int, step: String!): Dish
    
    
    

  }
`;

module.exports = typeDefs;


// addDishToFavorites() 
// addDishToHistory
// removeDishFromFavorites
// deleteDish
// #add a set of instructions
// #delete a dish
// #save a favorite dish