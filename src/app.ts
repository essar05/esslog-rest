import express from "express";
import mongoose from "mongoose";
import bluebird from "bluebird";
import compression from "compression";
import bodyParser from "body-parser";
import { MONGODB_URI, SESSION_SECRET } from "./config/secrets";
import session from "express-session";
import connect_mongo from "connect-mongo";
import passport from "passport";
import lusca from "lusca";
import { Request, Response, NextFunction } from "express";
import "./config/passport";
import { registerControllers } from "./core/register-controllers";
import { UserController } from "./controllers/user.controller";

const app = express();

mongoose.Promise = bluebird;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => {
    })
    .catch(error => {
        console.log("MongoDB Connection Error: " + error);
        process.exit();
    });
const MongoStore = connect_mongo(session);

app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

//app.use('/api', router);

registerControllers(app, [ UserController ]);

app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`${req.method} ${req.url} Not Found`);
    // @ts-ignore
    err.status = 404;
    next(err);
});
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    // @ts-ignore
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

export default app;