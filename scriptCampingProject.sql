DROP DATABASE IF EXISTS campingProject;
CREATE DATABASE campingProject
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campingProject;

CREATE TABLE `accomodation` (
  `id_hebergement` int NOT NULL AUTO_INCREMENT,
  `type_hebergement` int NOT NULL,
  `reference_interne` varchar(50) NOT NULL,
  `nom_commercial` varchar(150) NOT NULL,
  `description` text,
  `capacite_max` int NOT NULL,
  `surface_m2` int DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `reservable` tinyint(1) NOT NULL DEFAULT '1',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_desactivation` datetime DEFAULT NULL,
  PRIMARY KEY (`id_hebergement`),
  UNIQUE KEY `reference_interne` (`reference_interne`),
  KEY `type_hebergement` (`type_hebergement`),
  CONSTRAINT `accomodation_ibfk_1` FOREIGN KEY (`type_hebergement`) REFERENCES `accomodation_type` (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `accomodation_equipment` (
  `hebergement_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  PRIMARY KEY (`hebergement_id`,`equipment_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `accomodation_equipment_ibfk_1` FOREIGN KEY (`hebergement_id`) REFERENCES `accomodation` (`id_hebergement`),
  CONSTRAINT `accomodation_equipment_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id_equipment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `accomodation_type` (
  `id_type` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `capacite_max_par_defaut` int DEFAULT NULL,
  `surface_moyenne` int DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `tarif_id` int DEFAULT NULL,
  PRIMARY KEY (`id_type`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_accomodation_type_tarif` (`tarif_id`),
  CONSTRAINT `fk_accomodation_type_tarif` FOREIGN KEY (`tarif_id`) REFERENCES `tarif` (`id_tarif`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `accomodation_type` (
  `id_type` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `capacite_max_par_defaut` int DEFAULT NULL,
  `surface_moyenne` int DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `tarif_id` int DEFAULT NULL,
  PRIMARY KEY (`id_type`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_accomodation_type_tarif` (`tarif_id`),
  CONSTRAINT `fk_accomodation_type_tarif` FOREIGN KEY (`tarif_id`) REFERENCES `tarif` (`id_tarif`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `booking` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `source` varchar(50) NOT NULL DEFAULT 'web',
  `cree_le` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente_paiement',
  `arrivee_globale` date NOT NULL,
  `depart_globale` date NOT NULL,
  `nb_total_personnes` int NOT NULL,
  `montant_brut` decimal(10,2) NOT NULL,
  `montant_remise` decimal(10,2) NOT NULL,
  `montant_net` decimal(10,2) NOT NULL DEFAULT '0.00',
  `montant_paye` decimal(10,2) NOT NULL,
  `solde_restant` decimal(10,2) NOT NULL,
  `commentaire_client` text,
  `notes_internes` text,
  `cgv_acceptees` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `booking` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `source` varchar(50) NOT NULL DEFAULT 'web',
  `cree_le` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente_paiement',
  `arrivee_globale` date NOT NULL,
  `depart_globale` date NOT NULL,
  `nb_total_personnes` int NOT NULL,
  `montant_brut` decimal(10,2) NOT NULL,
  `montant_remise` decimal(10,2) NOT NULL,
  `montant_net` decimal(10,2) NOT NULL DEFAULT '0.00',
  `montant_paye` decimal(10,2) NOT NULL,
  `solde_restant` decimal(10,2) NOT NULL,
  `commentaire_client` text,
  `notes_internes` text,
  `cgv_acceptees` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `coupon` (
  `id_coupon` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type_reduction` varchar(50) NOT NULL,
  `valeur` decimal(10,2) NOT NULL,
  `montant_min` decimal(10,2) DEFAULT NULL,
  `validite_debut` date NOT NULL,
  `validite_fin` date NOT NULL,
  `max_utilisations` int DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_coupon`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `coupon_usage` (
  `id_usage` int NOT NULL AUTO_INCREMENT,
  `coupon_id` int NOT NULL,
  `reservation_id` int NOT NULL,
  `montant_remise` decimal(10,2) NOT NULL,
  `date_utilisation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usage`),
  KEY `coupon_id` (`coupon_id`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id_coupon`),
  CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `booking` (`id_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `email_log` (
  `id_email` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int DEFAULT NULL,
  `reservation_id` int DEFAULT NULL,
  `type_email` varchar(50) NOT NULL,
  `destinataire` varchar(255) NOT NULL,
  `sujet` varchar(255) NOT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `message_erreur` text,
  `cree_le` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `envoye_le` datetime DEFAULT NULL,
  PRIMARY KEY (`id_email`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `email_log_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id_user`),
  CONSTRAINT `email_log_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `booking` (`id_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employee` (
  `id_employee` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `role_interne` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_employee`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employee_shift` (
  `id_shift` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `debut` datetime NOT NULL,
  `fin` datetime NOT NULL,
  `commentaire` text,
  PRIMARY KEY (`id_shift`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `employee_shift_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id_employee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipment` (
  `id_equipment` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id_equipment`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invoice` (
  `id_facture` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int NOT NULL,
  `numero_facture` varchar(50) NOT NULL,
  `date_emission` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `montant_ht` decimal(10,2) NOT NULL,
  `montant_tva` decimal(10,2) NOT NULL,
  `montant_ttc` decimal(10,2) NOT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'emise',
  `pdf_genere` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_facture`),
  UNIQUE KEY `numero_facture` (`numero_facture`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `booking` (`id_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `option_service` (
  `id_option` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `type_tarification` varchar(50) NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_option`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `payment` (
  `id_payment` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `devise` varchar(10) NOT NULL DEFAULT 'EUR',
  `moyen_paiement` varchar(50) NOT NULL,
  `fournisseur` varchar(50) NOT NULL DEFAULT 'Stripe',
  `transaction_id` varchar(255) DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `cree_le` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_payment`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `booking` (`id_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `code_role` varchar(50) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `code_role` (`code_role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `season` (
  `id_saison` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `description` text,
  PRIMARY KEY (`id_saison`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stay` (
  `id_sejour` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int NOT NULL,
  `hebergement_id` int NOT NULL,
  `arrivee` date NOT NULL,
  `depart` date NOT NULL,
  `adultes` int NOT NULL,
  `enfants` int NOT NULL,
  `prix_nuit` decimal(10,2) NOT NULL,
  `nb_nuits` int NOT NULL,
  `total_sejour` decimal(10,2) NOT NULL,
  `commentaire` text,
  PRIMARY KEY (`id_sejour`),
  KEY `reservation_id` (`reservation_id`),
  KEY `hebergement_id` (`hebergement_id`),
  CONSTRAINT `stay_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `booking` (`id_reservation`),
  CONSTRAINT `stay_ibfk_2` FOREIGN KEY (`hebergement_id`) REFERENCES `accomodation` (`id_hebergement`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stay_option` (
  `id_stayoption` int NOT NULL AUTO_INCREMENT,
  `sejour_id` int NOT NULL,
  `option_id` int NOT NULL,
  `quantite` int NOT NULL,
  `total_option` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_stayoption`),
  KEY `sejour_id` (`sejour_id`),
  KEY `option_id` (`option_id`),
  CONSTRAINT `stay_option_ibfk_1` FOREIGN KEY (`sejour_id`) REFERENCES `stay` (`id_sejour`),
  CONSTRAINT `stay_option_ibfk_2` FOREIGN KEY (`option_id`) REFERENCES `option_service` (`id_option`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `support_ticket` (
  `id_ticket` int NOT NULL AUTO_INCREMENT,
  `client_id` int DEFAULT NULL,
  `sujet` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'ouvert',
  `priorite` varchar(50) NOT NULL DEFAULT 'normale',
  `cree_le` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mis_a_jour_le` datetime DEFAULT NULL,
  PRIMARY KEY (`id_ticket`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `support_ticket_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tarif` (
  `id_tarif` int NOT NULL AUTO_INCREMENT,
  `type_hebergement_id` int NOT NULL,
  `saison_id` int NOT NULL,
  `personnes_incluses` int NOT NULL,
  `prix_par_nuit` decimal(10,2) NOT NULL,
  `supplement_personne` decimal(10,2) DEFAULT NULL,
  `min_nuits` int DEFAULT NULL,
  `validite_debut` date DEFAULT NULL,
  `validite_fin` date DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_tarif`),
  KEY `type_hebergement_id` (`type_hebergement_id`),
  KEY `saison_id` (`saison_id`),
  CONSTRAINT `tarif_ibfk_1` FOREIGN KEY (`type_hebergement_id`) REFERENCES `accomodation_type` (`id_type`),
  CONSTRAINT `tarif_ibfk_2` FOREIGN KEY (`saison_id`) REFERENCES `season` (`id_saison`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_role` (
  `id_affectation` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `date_affectation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_affectation`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `adresse_ligne1` varchar(255) DEFAULT NULL,
  `adresse_ligne2` varchar(255) DEFAULT NULL,
  `code_postal` varchar(20) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `type_compte` varchar(50) NOT NULL DEFAULT 'user',
  `twofa_active` tinyint(1) NOT NULL DEFAULT '0',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `derniere_connexion` datetime DEFAULT NULL,
  `compte_actif` tinyint(1) NOT NULL DEFAULT '1',
  `commentaire_interne` text,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
