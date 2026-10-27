import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

interface ITitleGenre extends Model {
    titleId: number;
    genreId: number;
}

// join table between titles and genres
const TitleGenre = sequelize.define<ITitleGenre>(
    "TitleGenre",
    {
        titleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        genreId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        tableName: "title_genres",
        underscored: true,
        timestamps: false,
    },
);

export default TitleGenre;
