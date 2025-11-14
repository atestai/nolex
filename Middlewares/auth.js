export const authMiddleware = (req, _, next) => {
    req.user = {
        id: 1,
        username: 'testuser',
        role: 'admin'
    }
    next();
};