import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/sequelize.connection.ts";

const sequelize = sequelizeConnection.getSequelize();

export type SubscriptionStatus = "pending" | "active" | "past_due" | "canceled" | "expired";

export interface ISubscription extends Model {
    id: number;
    userId: number;
    planId: number;
    status: SubscriptionStatus;
    stripeSubsId: string | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
}

const Subscription = sequelize.define<ISubscription>(
    "Subscription",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        planId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // starts as pending, only the Stripe webhook changes it to active
        status: {
            type: DataTypes.ENUM("pending", "active", "past_due", "canceled", "expired"),
            allowNull: false,
            defaultValue: "pending",
        },
        // Stripe subscription id, filled by the webhook after the payment
        stripeSubsId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        currentPeriodEnd: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "subscriptions",
        underscored: true,
        timestamps: true,
        updatedAt: false,
    },
);

export default Subscription;