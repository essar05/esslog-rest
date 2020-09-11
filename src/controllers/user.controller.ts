import passport from "passport";
import { User, UserDocument } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { check, validationResult } from "express-validator";
import { Controller } from "../core/decorators/controller";
import { Post } from "../core/decorators/post";
import BaseController from "../core/base-controller";
import jwt from "jsonwebtoken";
import { SESSION_SECRET } from "../config/secrets";
import { Get } from "../core/decorators/get";
import { RequiresAuthentication } from "../core/decorators/requires-authentication";

@Controller('/api/user')
export class UserController extends BaseController {

    constructor() {
        super();
    }

    @Post('/login')
    public async login(req: Request, res: Response, next: NextFunction) {
        await check("username", "Username is not valid").isAlphanumeric().isLength({min: 2}).run(req);
        await check("password", "Password cannot be blank").isLength({min: 1}).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            res.status(400);
            res.json({
                error: 'auth_failed'
            });
            return;
        }

        passport.authenticate("local", (error: Error, user: UserDocument, info: IVerifyOptions) => {
            if (error) {
                return next(error);
            }

            if (!user) {
                res.status(400);
                res.json({
                    error: info.message
                });
                return;
            }

            req.logIn(user, (error) => {
                if (error) {
                    return next(error);
                }

                const body = { username: user.username, email: user.email };
                const token = jwt.sign({ user : body }, SESSION_SECRET);

                res.json({ token });
            });
        })(req, res, next);
    };

    @Post('/logout')
    public logout(req: Request, res: Response) {
        req.logout();
        res.json();
    };

    @RequiresAuthentication()
    @Get('/me')
    public me(req: Request, res: Response) {
        res.json({
            message : 'You made it to the secure route',
            user : req.user,
            token : req.query.secret_token
        })
    };

    @Post('/seed')
    public async seed(req: Request, res: Response, next: NextFunction) {
        const user = new User({
            username: 'essar',
            email: 'glaedrthewise@gmail.com',
            password: 'admin123',
            profile: {
                name: 'Essar'
            }
        });

        const userByEmail = await User.findOne({email: user.email}).exec();
        const userByUsername = await User.findOne({username: user.username}).exec();

        if (userByEmail) {
            res.status(400);
            res.json({
                error: 'Email already exists'
            });
            return;
        }

        if (userByUsername) {
            res.status(400);
            res.json({
                error: 'Username already exists'
            });
            return;
        }

        await user.save((err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                res.json();
            });
        });
    };

}