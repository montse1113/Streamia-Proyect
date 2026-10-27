import User from "./User.ts";
import Title from "./Title.ts";
import Genre from "./Genre.ts";
import TitleGenre from "./TitleGenre.ts";
import Season from "./Season.ts";
import Episode from "./Episode.ts";

// relations
Title.belongsToMany(Genre, { through: TitleGenre, as: "genres", foreignKey: "titleId", otherKey: "genreId" });
Genre.belongsToMany(Title, { through: TitleGenre, as: "titles", foreignKey: "genreId", otherKey: "titleId" });

Title.hasMany(Season, { as: "seasons", foreignKey: "titleId" });
Season.belongsTo(Title, { foreignKey: "titleId" });

Season.hasMany(Episode, { as: "episodes", foreignKey: "seasonId" });
Episode.belongsTo(Season, { foreignKey: "seasonId" });

export { User, Title, Genre, TitleGenre, Season, Episode };
