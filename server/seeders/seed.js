const db = require("../config/connection");
const { User, Dish, Instructions } = require("../models");
const userSeeds = require("./userSeeds.json");
const dishSeeds = require("./dishSeeds.json");
const instructionsSeeds = require("./instructionsSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Dish.deleteMany({});
    await Instructions.deleteMany({});

    await User.create(userSeeds);

    for (let i = 0; i < dishSeeds.length; i++) {
      const instructions = await Instructions.create(instructionsSeeds[i]);
      const { _id, dishAuthor } = await Dish.create({ ...dishSeeds[i], instructions_id: instructions._id });
      const user = await User.findOneAndUpdate(
        { username: dishAuthor },
        {
          $addToSet: {
            created_dishes: _id,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("All done!");
  process.exit(0);
});
