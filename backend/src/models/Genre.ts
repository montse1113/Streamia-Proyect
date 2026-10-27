import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface IGenre extends Model {
    id: number;
    name: string;
}

const Genre = sequelize.define<IGenre>(
    "Genre",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "genres",
        underscored: true,
        timestamps: false,
    },
);

export default Genre;
