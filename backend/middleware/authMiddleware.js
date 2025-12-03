import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token manquant' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        return res.status(401).json({ message: 'Token invalide' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.type_compte !== 'admin') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    next();
};


const ownerOrAdminMiddleware = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if (req.user.id_user !== userId && req.user.type_compte !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id_user: user.id_user,
            email: user.email,
            type_compte: user.type_compte
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};


const generateRefreshToken = (user) => {
    return jwt.sign(
        { id_user: user.id_user },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};




export {
    authMiddleware,
    adminMiddleware,
    ownerOrAdminMiddleware,
    generateToken,
    generateRefreshToken,
};
