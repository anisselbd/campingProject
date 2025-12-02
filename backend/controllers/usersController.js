import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    updatePassword,
    updateLastLogin,
    deleteUser,
    deactivateUser,
    activateUser,
    verifyPassword
} from '../models/usersModel.js';
import { generateToken, generateRefreshToken } from '../middleware/authMiddleware.js';


const getAll = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const register = async (req, res) => {
    try {
        const { email, password, prenom, nom, telephone, adresse_ligne1, adresse_ligne2, code_postal, ville, pays } = req.body;
        if (!email || !password || !prenom || !nom) {
            return res.status(400).json({ message: 'Email, mot de passe, prénom et nom sont obligatoires' });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }
        const userId = await createUser({
            email,
            password,
            prenom,
            nom,
            telephone,
            adresse_ligne1,
            adresse_ligne2,
            code_postal,
            ville,
            pays
        });
        res.status(201).json({ 
            message: 'Utilisateur créé avec succès',
            userId 
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe sont obligatoires' });
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        if (!user.compte_actif) {
            return res.status(403).json({ message: 'Votre compte est désactivé' });
        }
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        await updateLastLogin(user.id_user);
        const { password: userPassword, ...userWithoutPassword } = user;

        // Générer les tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({ 
            message: 'Connexion réussie',
            user: userWithoutPassword,
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, prenom, nom, telephone, adresse_ligne1, adresse_ligne2, code_postal, ville, pays } = req.body;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        if (email && email !== user.email) {
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Cet email est déjà utilisé' });
            }
        }
        await updateUser(id, {
            email: email || user.email,
            prenom: prenom || user.prenom,
            nom: nom || user.nom,
            telephone: telephone || user.telephone,
            adresse_ligne1: adresse_ligne1 || user.adresse_ligne1,
            adresse_ligne2: adresse_ligne2 || user.adresse_ligne2,
            code_postal: code_postal || user.code_postal,
            ville: ville || user.ville,
            pays: pays || user.pays
        });
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Ancien et nouveau mot de passe sont obligatoires' });
        }
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const isValidPassword = await verifyPassword(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }
        await updatePassword(id, newPassword);
        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const remove = async (req, res) => { 
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await deleteUser(id);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const desactivate = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await deactivateUser(id);
        res.status(200).json({ message: 'Compte désactivé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la désactivation du compte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const activate = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await activateUser(id);
        res.status(200).json({ message: 'Compte activé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'activation du compte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export {
    getAll,
    getById,
    register,
    login,
    update,
    changePassword,
    remove,
    desactivate,
    activate
};
