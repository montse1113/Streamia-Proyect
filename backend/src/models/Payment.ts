import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export interface IPayment extends Model {
    id: number;
    subscriptionId: number;
    userId: number;
    amount: string;
    currency: string;
    status: "succeeded" | "failed" | "refunded";
    stripeEventId: string;
    paidAt: Date | null;
}

const Payment = sequelize.define<IPayment>(
    "Payment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        subscriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.CHAR(3),
            allowNull: false,
            defaultValue: "MXN",
        },
        status: {
            type: DataTypes.ENUM("succeeded", "failed", "refunded"),
            allowNull: false,
        },
        // unique, so the same webhook event is never saved twice (idempotency)
        stripeEventId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "payments",
        underscored: true,
        timestamps: false,
    },
);

export default Payment;