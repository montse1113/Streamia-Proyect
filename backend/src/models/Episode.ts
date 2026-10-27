import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface IEpisode extends Model {
    id: number;
    seasonId: number;
    number: number;
    name: string;
    durationMin: number | null;
    videoUrl: string;
}

const Episode = sequelize.define<IEpisode>(
    "Episode",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        seasonId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        durationMin: DataTypes.INTEGER,
        videoUrl: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
    },
    {
        tableName: "episodes",
        underscored: true,
        timestamps: false,
    },
);

export default Episode;
