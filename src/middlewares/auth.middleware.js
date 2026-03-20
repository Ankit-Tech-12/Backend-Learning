import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers?.Authorization?.split(" ")[1];

        // console.log("TOKEN :", token, typeof token);

        // if (!token || typeof token !== "string") {
        //     throw new ApiError(401, "Unauthorized access: token missing");
        // }
        // console.log("=== AUTH DEBUG ===");
        // console.log("All cookies:", req.cookies);
        // console.log("Headers:", req.headers);
        // console.log("Authorization header:", req.headers.authorization);
        // console.log("accessToken cookie:", req.cookies?.accessToken);
        // console.log("=================");

        // console.log("Final token:", token);
        // console.log("Token type:", typeof token);

        if (!token || typeof token !== "string") {
            throw new ApiError(401, "Unauthorized access: token missing");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token");
    }
});

