import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";
import type { IEpisode } from "./Episode.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface ISeason extends Model {
    id: number;
    titleId: number;
    number: number;
    episodes?: IEpisode[];
}

const Season = sequelize.define<ISeason>(
    "Season",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        titleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "seasons",
        underscored: true,
        timestamps: false,
    },
);

export default Season;
