const { AuthenticationError } = require("apollo-server-express");
const { User, Dish, Instructions } = require("../models");
const { signToken } = require("../utils/auth");

/*==================

await Dish.find({}, null, {sort: { _id: -1}, limit: 5})
await Dish.find({}).sort({_id: -1}).limit(5).exec()

==================*/

const resolvers = {
	Query: {
		users: async () => {
			return await User.find();
		},
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id });
			}
			throw new AuthenticationError("You need to be logged in!");
		},
		userDishes: async (_, args) => {
			const { created_dishes } = await User.findById(
				args.id,
				"created_dishes"
			).populate("created_dishes");
			return created_dishes;
		},
		userHistory: async (_, args) => {
			const { history_dishes } = await User.findById(
				args.id,
				"history_dishes"
			).populate("history_dishes");
			return history_dishes;
		},
		userFavorites: async (_, args) => {
			const { favorite_dishes } = await User.findById(
				args.id,
				"favorite_dishes"
			).populate("favorite_dishes");
			return favorite_dishes;
		},
		allDishes: async () => {
			return await Dish.find();
		},
		dishById: async (_, args) => {
			return await Dish.findById(args.id).populate("instructions");
		},
		userById: async (_, args) => {
			return await User.findById(args.id);
		},
		fourRandomDishes: async () => {
			return await Dish.aggregate([{ $sample: { size: 4 } }]);
		},
		lastFourDishes: async () => {
			return await Dish.find({}, null, { sort: { _id: -1 }, limit: 4 });
		},
		dishesByName: async (_, args) => {
			const search = args.title;
			return await Dish.find({ title: { $regex: new RegExp(search, "i") } });
		},
		usernameCreatedDishes: async (_, { username }) => {
			return await Dish.find({ username: username });
		},
	},
	Mutation: {
		addUser: async (_, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (_, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("No user found with this email address");
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const token = signToken(user);

			return { token, user };
		},

		uploadDish: async (
			_,
			{ title, username, description, image, ingredients, recipe, cook_time },
			context
		) => {
			//if (context.user) {
			// const newDish = new Dish({
			//   title,
			//   username,
			//   description,
			//   image,
			//   ingredients,
			//   recipe,
			//   cook_time,
			// });

			// await User.findByIdAndUpdate(context.user.id, {
			//   $push: { created_dishes: newDish },
			// });

			const newDish = Dish.create({
				title,
				username,
				description,
				image,
				ingredients,
				recipe,
				cook_time,
			});

			return newDish;
			// }
		},
	},
};

module.exports = resolvers;
