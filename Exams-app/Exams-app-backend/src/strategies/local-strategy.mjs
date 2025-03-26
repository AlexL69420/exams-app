import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import pool from "../utils/data.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('deserializing!!!')
    console.log(id)
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [parseInt(id)]);
    if (result.rows.length === 0) {
      return done(null, false);
    }
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (result.rows.length === 0) {
        return done(null, false, { message: "Пользователь не найден" });
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return done(null, false, { message: "Неверный пароль" });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);