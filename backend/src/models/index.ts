import User from "./User.ts";
import Title from "./Title.ts";
import Genre from "./Genre.ts";
import TitleGenre from "./TitleGenre.ts";
import Season from "./Season.ts";
import Episode from "./Episode.ts";
import Plan from "./Plan.ts";
import Subscription from "./Subscription.ts";
import Payment from "./Payment.ts";

// relations
Title.belongsToMany(Genre, { through: TitleGenre, as: "genres", foreignKey: "titleId", otherKey: "genreId" });
Genre.belongsToMany(Title, { through: TitleGenre, as: "titles", foreignKey: "genreId", otherKey: "titleId" });

Title.hasMany(Season, { as: "seasons", foreignKey: "titleId" });
Season.belongsTo(Title, { foreignKey: "titleId" });

Season.hasMany(Episode, { as: "episodes", foreignKey: "seasonId" });
Episode.belongsTo(Season, { foreignKey: "seasonId" });

User.hasMany(Subscription, { as: "subscriptions", foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

Plan.hasMany(Subscription, { as: "subscriptions", foreignKey: "planId" });
Subscription.belongsTo(Plan, { as: "plan", foreignKey: "planId" });

Subscription.hasMany(Payment, { as: "payments", foreignKey: "subscriptionId" });
Payment.belongsTo(Subscription, { foreignKey: "subscriptionId" });

User.hasMany(Payment, { as: "payments", foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

export { User, Title, Genre, TitleGenre, Season, Episode, Plan, Subscription, Payment };
