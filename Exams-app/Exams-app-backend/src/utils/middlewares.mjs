
// Middleware для проверки авторизации
export const isAuthenticated = (req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Пользователь не авторизован" });
  };

// Middleware для проверки роли суперпользователя
export const isSuperuser = (req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user)
  if (req.user && req.user.role === "superuser") {
    return next();
  }
  res.status(403).json({ error: "Доступ запрещён" });
};

// Middleware для проверки роли суперпользователя
export const isSuperuserorAuthor = (req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user)
  if (req.user && (req.user.role === "superuser" || req.user.role === "author")) {
    return next();
  }
  res.status(403).json({ error: "Доступ запрещён" });
};