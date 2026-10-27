import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";
import type { IGenre } from "./Genre.ts";
import type { ISeason } from "./Season.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface ITitle extends Model {
    id: number;
    type: "movie" | "series";
    title: string;
    synopsis: string | null;
    releaseYear: number | null;
    ageRating: string | null;
    durationMin: number | null;
    posterUrl: string | null;
    videoUrl: string | null;
    isActive: boolean;
    // filled when the query includes them
    genres?: IGenre[];
    seasons?: ISeason[];
}

const Title = sequelize.define<ITitle>(
    "Title",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.ENUM("movie", "series"),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        synopsis: DataTypes.TEXT,
        releaseYear: DataTypes.INTEGER,
        ageRating: DataTypes.STRING(10),
        // durationMin and videoUrl are only used by movies
        durationMin: DataTypes.INTEGER,
        posterUrl: DataTypes.STRING(500),
        videoUrl: DataTypes.STRING(500),
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "titles",
        underscored: true,
        timestamps: false,
    },
);

export default Title;
