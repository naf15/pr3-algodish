import { gql } from "@apollo/client";

//Get all dishes from the database
export const FETCH_ALL_DISHES = gql`
  query allDishes {
    allDishes {
      _id
      title
      username
      image
      description
      cook_time
    }
  }
`;

//Why is this suddenly not working
export const FETCH_DISH_BY_ID = gql`
  query dishById($id: ID!) {
    dishById(id: $id) {
      _id
      title
      username
      image
      description
      cook_time
    }
  }
`;

//Get One Master Dish
export const FETCH_WHOLE_DISH_BY_ID = gql`
  query dishById($id: ID!) {
    dishById(id: $id) {
      title
      username
      image
      description
      cook_time
      ingredients
      recipe
    }
  }
`;

//Get all dishes by user ID (created_dishes)
export const FETCH_CREATED_DISHES = gql`
  query userDishes($id: ID!) {
    userDishes(id: $id) {
      title
      username
      image
      description
      cook_time
      ingredients
    }
  }
`;

//five random dishes
export const FETCH_FOUR_RANDOM_DISHES = gql`
  query fourRandomDishes {
    fourRandomDishes {
      title
      username
      image
      description
      cook_time
    }
  }
`;

//last five dishes
export const FETCH_LAST_FOUR_DISHES = gql`
  query lastFiveDishes {
    lastFiveDishes {
      title
      username
      image
      description
      cook_time
    }
  }
`;

//Get dishes by name
export const FETCH_DISH_BY_NAME = gql`
  query dishesByName($title: String!) {
    dishesByName(title: $title) {
      title
      username
      image
      description
      cook_time
    }
  }
`;

//Get all users
export const FETCH_USERS = gql`
  query users {
    users {
      _id
      username
    }
  }
`;
