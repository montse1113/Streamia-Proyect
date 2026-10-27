import rateLimit from "express-rate-limit";

// 5 failed login attempts every 15 minutes per IP, then 429
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "too many login attempts, try again later" },
});
