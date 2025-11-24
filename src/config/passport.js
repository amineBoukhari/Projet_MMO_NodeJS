import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import config from './config.js';
import User from '../module/user/user.model.js';

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.JWT_ACCESS_TOKEN_SECRET_PUBLIC,
			algorithms: 'RS256'
		},
		async (jwtPayload, done) => {
			try {
				const user = await User.getUser(jwtPayload.sub);
				if (!user) {
					return done(null, false);
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

export default passport;