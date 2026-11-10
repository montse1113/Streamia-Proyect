import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface IPlan extends Model {
    id: number;
    name: string;
    price: string;
    maxQuality: "SD" | "HD" | "4K";
    maxScreens: number;
    priceId: string | null;
    isActive: boolean;
}

const Plan = sequelize.define<IPlan>(
    "Plan",
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
        // price in MXN, always read from the database, never from the request
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        maxQuality: {
            type: DataTypes.ENUM("SD", "HD", "4K"),
            allowNull: false,
        },
        maxScreens: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Stripe price id, not sent to the client
        priceId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "plans",
        underscored: true,
        timestamps: false,
    },
);

export default Plan;
