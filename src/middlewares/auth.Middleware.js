import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("Falta la variable de entorno JWT_SECRET");
            return res.status(500).json({ error: "Internal server error" });
        }

        const decoded = jwt.verify(token, secretKey);

        const userId = decoded.sub || decoded.id; 
        const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const genres = decoded.genres ? decoded.genres.split(',') : [];
        req.user = {
            id: userId,
            role: role,
            genres: genres
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};