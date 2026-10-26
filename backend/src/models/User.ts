import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

interface IUser extends Model {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "admin" | "customer";
    isActive: boolean;
    createAt: Date;
}

const User = sequelize.define<IUser>(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        }, 
        // bcrypt hash, never the real password
        passwrod: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("admin", "customer"),
            allowNull: false,
            defaultValue: "customer",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "users",
        underscored: true,
        timestamps: true,
        updatedAt: false,
    },
);

export default User;