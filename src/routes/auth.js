
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { ObjectId } from "mongodb";

import { getDBConnection } from "../db.js";

const authRouter = Router();
const authUserRouter = Router();

authRouter.route("/login").post(async (req, res) => {
    try {
        console.log("Request at : api/login");
        const { email, password } = req.body;
        const db = getDBConnection("education");
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            res.sendStatus(401);
        } else {
            const { _id: id, passwordHash, info, isVerified } = user;
            const isCorrectPW = await bcrypt.compare(password, passwordHash);
            if (isCorrectPW) {
                await createJWT({ id, email, info, isVerified })
                    .then((token) => res.status(200).json({ token }))
                    .catch((_e) =>
                        res.status(500).json({ message: "Server Error: to get a token" })
                    );
            } else {
                res.sendStatus(401);
            }
        }
    } catch (err) {
        console.log("Failed the login process");
        console.log(err);

    }
});

authRouter.route("/signup").post(async (req, res) => {
    console.log("Request at : api/signup");
    try {
        const { email, password } = req.body;
        const db = getDBConnection("education");
        const user = await db.collection("users").findOne({ email: email });
        if (user) {
            // res.status(409).json({ message: "user already exist" });
            res.sendStatus(409);
            return;
        } else {
            const pwHash = await bcrypt.hash(password, 10);
            const startingInfo = {
                name: "",
                eduQualification: "",
                examStatus: "",
            };
            const result = await db.collection("users").insertOne({
                email: email,
                passwordHash: pwHash,
                info: startingInfo,
                isVerified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            const { insertedId } = result;
            await createJWT({
                id: insertedId,
                email,
                info: startingInfo,
                isVerified: false,
            })
                .then((token) => res.status(200).json({ token }))
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ message: "Server Error" });
                });
        }
    } catch (err) {
        console.log("Failed the signup process");
        console.log(err);
    }
});

authUserRouter.route("/users/:userId").put(async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;
    console.log("Request at : api/users");
    const updateInfo = (({ name, eduQualification, examStatus }) => ({
        name,
        eduQualification,
        examStatus,
    }))(req.body);
    if (!authorization) {
        res.status(401).json({ message: "No Authorization" });
    } else {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ messahe: "Unable to verify" });
            }
            const { id } = decoded;
            if (id !== userId) {
                return res
                    .status(403)
                    .json({ message: "Not allowed to update this user's info" });
            }
            const db = getDBConnection("education");
            const result = await db
                .collection("users")
                .findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    // { inputId: id },
                    { $set: { info: updateInfo, updatedAt: new Date().toISOString() } },
                    { returnDocument: "after" }
                )
                .then((data) => {
                    // console.log(data);
                    return data;
                })
                .catch((err) => {
                    console.log(err);
                    return err;
                });
            const { email, info, isVerified } = result;
            await createJWT({ id, email, info, isVerified })
                .then((token) => {
                    return res.status(200).json({ token });
                })
                .catch((err) => {
                    return res.statua(200).json({ message: err });
                });
        });
    }

});

const createJWT = async ({ id, email, info, isVerified }) => {
    const token = jwt.sign(
        { id: id, email: email, info: info, isVerified: isVerified },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    return token;
};

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401);
        res.json({ message: "Not Authorized" });
        return;
    }
    const [_, token] = bearer.split(" ");
    if (!token) {
        res.status(401);
        res.json({ message: "Not a valid Token" });
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401);
        res.json({ message: "Not a valid Token" });
        return;
    }
};

export { authRouter, authUserRouter }
