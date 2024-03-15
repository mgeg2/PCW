-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 12, 2024 at 07:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Borrar la base de datos si ya estuviera
--
DROP DATABASE IF EXISTS recetas;

--
-- Base de datos: `recetas`
--
CREATE DATABASE IF NOT EXISTS `recetas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `recetas`;

--
-- Dar permisos al usuario 'pcw' con password 'pcw'
--
GRANT ALL PRIVILEGES ON recetas.* TO pcw@'localhost' IDENTIFIED BY 'pcw';

-- --------------------------------------------------------

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `texto` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `idReceta` int(11) NOT NULL COMMENT 'id de la receta a la que pertenece el comentario',
  `fechaHora` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha y hora a la que se hace el comentario',
  `autor` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comentario`
--

INSERT INTO `comentario` (`id`, `titulo`, `texto`, `idReceta`, `fechaHora`, `autor`) VALUES
(1, 'Sugerencia', 'Yo le suelo echar atún de vez en cuando y también quedan muy buenos.', 1, '2023-12-27 15:58:23', 'usuario2'),
(2, 'Para salir del paso', 'Es una receta perfecta y sencilla. Muchas gracias!!!', 1, '2024-01-07 18:14:56', 'usuario3'),
(3, 'Gran aportación!!', 'He hecho esta receta y, aunque no soy muy bueno en la cocina, me han salido unos macarrones buenísimos. Muchas gracias por tu receta!!', 1, '2024-01-14 11:35:28', 'usuario5'),
(4, 'Muy buena pinta', 'Tiene una pinta muy buena. Seguro que está mejor todavía!!. El domingo lo hago para comer. Ya os dejaré un comentario de cómo me salió.', 2, '2024-01-30 09:29:21', 'usuario2'),
(5, 'Salmorreta', 'Me puedes decir qué es la salmorreta, es que es la primera vez que oigo esa palabra.', 2, '2024-01-31 11:11:55', 'usuario4'),
(6, 'Una idea alternativa', 'Se puede utilizar nocilla o cualquier otra crema de cacao en lugar de mezclar la nata con el chocolate. Así tardamos menos :-)', 3, '2024-02-10 08:07:02', 'usuario1'),
(7, 'Genial dulce!!', 'Está buenísimo. No sólo para la merienda, sino también para tomar con el café después de comer.', 3, '2024-02-12 17:19:22', 'usuario5'),
(8, 'No está mal', 'No queda mal, pero creo que la de toda la vida está mejor.', 4, '2024-02-11 08:32:22', 'usuario2'),
(9, 'Más opciones', 'Igual que se le puede echar la cebolla, yo también le echo pimiento y así está más buena. Es sólo una sugerencia, pero queda mucho más buena.', 4, '2024-02-11 13:04:22', 'usuario3'),
(10, 'No me convence', 'Opino como el otro usuario, donde esté la tortilla de toda la vida que se quiten estos experimentos.', 4, '2024-02-12 11:48:23', 'usuario1');

-- --------------------------------------------------------

--
-- Table structure for table `etiqueta`
--

DROP TABLE IF EXISTS `etiqueta`;
CREATE TABLE `etiqueta` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `etiqueta`
--

INSERT INTO `etiqueta` (`id`, `nombre`) VALUES
(1, 'Pasta'),
(2, 'Carne'),
(3, 'Pescado'),
(4, 'Plato principal'),
(5, 'Entrante'),
(6, 'Postre'),
(8, 'Receta horno'),
(9, 'Receta catalana'),
(10, 'Receta española'),
(11, 'Merienda'),
(12, 'Freidora de aire');

-- --------------------------------------------------------

--
-- Table structure for table `foto`
--

DROP TABLE IF EXISTS `foto`;
CREATE TABLE `foto` (
  `id` int(11) NOT NULL,
  `archivo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Nombre del fichero',
  `descripcion` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `idReceta` int(11) NOT NULL COMMENT 'id de la receta a la que pertenece la foto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `foto`
--

INSERT INTO `foto` (`id`, `archivo`, `descripcion`, `idReceta`) VALUES
(1, '1.png', 'Aspecto de cómo quedan los macarrones con tomate', 1),
(2, '2.jpg', 'Una vez pochanda la cebolla con el ajo añadimos el tomate triturado.', 1),
(3, '3.jpg', 'Salteamos el bacon en una sartén distinta a la de la salsa.', 1),
(4, '4.jpg', 'Cuando tenemos el bacon dorado se añade a la salsa y ya sólo queda mezclar con los macarrones una vez hervidos.', 1),
(5, '5.jpg', 'Aspecto final del arroz con carne.', 2),
(6, '6.jpg', 'Ponchando la cebolla y los pimientos bien picados en trozos finos.', 2),
(7, '7.jpg', 'La carne de cerdo se dora en la misma junto a la cebolla y el pimiento ya pochado.', 2),
(8, '8.jpg', 'Se añade un poco de tomate, la salmorreta y el azafrán. No hay que pasarse con el tomate.', 2),
(9, '9.jpg', 'Se echa el arroz para sofreír durante unos minutos.', 2),
(10, '10.jpg', 'Hay que cubrir todo con el caldo.', 2),
(11, '11.webp', 'Aspecto final de la coca', 3),
(12, '12.webp', 'Cuando la nata está caliente se echa el chocolate en trozos y se remueve', 3),
(13, '13.webp', 'Aspecto del chocolate deshecho y mezclado con la nata', 3),
(14, '14.webp', 'Se esparce el chocolate por la lámina de hojaldre sin llegar a los bordes', 3),
(15, '15.webp', 'Se pone la otra lámina encima y se unen los bordes de las dos láminas', 3),
(16, '16.webp', 'Coca una vez pintada con el huevo batido y con los piñones y el azúcar', 3),
(17, '17.webp', 'Este es el aspecto que tiene cuando está en su punto y la sacamos del horno', 3),
(18, '18.webp', 'Podemos ver que queda cuajada y en su punto', 4),
(19, '19.webp', 'Las patatas bien peladas las cortamos en rodajas finas', 4),
(20, '20.webp', 'Una vez bien escurridas las metemos en la freidora de aire', 4),
(21, '21.webp', 'Mezclamos las patatas ya cocidas con los huevos batidos y un poco de sal.', 4),
(22, '22.webp', 'Cuando tenemos la mezcla bien hecha, la metemos otra vez en la freidora de aire', 4),
(23, '23.webp', 'Cuando veamos que está a nuestro gusto la sacamos de la freidora y ... ¡¡¡a comer!!!', 4);

-- --------------------------------------------------------

--
-- Table structure for table `ingrediente`
--

DROP TABLE IF EXISTS `ingrediente`;
CREATE TABLE `ingrediente` (
  `id` int(11) NOT NULL,
  `texto` varchar(100) NOT NULL,
  `idReceta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingrediente`
--

INSERT INTO `ingrediente` (`id`, `texto`, `idReceta`) VALUES
(1, '500 gramos de macarrones', 1),
(2, '1kg de tomate triturado', 1),
(3, '200 gramos de bacon en tiras', 1),
(4, '2 cebollas', 1),
(5, '2 dientes de ajo', 1),
(6, 'Aceite de oliva virgen extra', 1),
(7, 'Sal', 1),
(8, 'Orégano', 1),
(9, '300 gramos de arroz bomba', 2),
(10, '300 gramos de carne de cerdo', 2),
(11, '1 cebolleta', 2),
(12, 'Medio pimiento verde', 2),
(13, 'Medio pimiento rojo', 2),
(14, '1 litro de Caldo de carne casero', 2),
(15, '100 ml de tomate frito', 2),
(16, '1 cucharada de salmorreta (opcional)', 2),
(17, 'Hebras de azafrán', 2),
(18, 'Aceite de oliva', 2),
(22, '2 láminas de hojaldre', 3),
(23, '200 gramos de chocolate de fundir', 3),
(24, '150 mililitros de nata para montar (¾ taza)', 3),
(25, '1 huevo', 3),
(26, '1 puñado de piñones', 3),
(27, '2 cucharaditas de azúcar', 3),
(28, '1 puñado de almendra picada', 3),
(29, '5 patatas medianas', 4),
(30, '6 huevos', 4),
(31, 'aceite de oliva', 4),
(32, 'sal', 4);

-- --------------------------------------------------------

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
CREATE TABLE `receta` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `elaboracion` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fechaHora` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Fecha y hora de la publicación',
  `personas` tinyint(4) NOT NULL COMMENT 'Número de personas para las que es la receta',
  `dificultad` tinyint(4) NOT NULL COMMENT '0 - Baja; 1 - Media; 2 - Alta',
  `tiempo` tinyint(4) NOT NULL COMMENT 'Minutos de elaboración',
  `autor` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Usuario autor de la receta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receta`
--

INSERT INTO `receta` (`id`, `nombre`, `elaboracion`, `fechaHora`, `personas`, `dificultad`, `tiempo`, `autor`) VALUES
(1, 'Macarrones con tomate', 'Empezamos cociendo la pasta en abundante agua con sal. La tendremos hirviendo tanto tiempo como indique el fabricante en el envase. Normalmente suelen ser unos 10 minutos. También se puede echar aceite para evitar que se salga la espuma que genera la cocción de la pasta.<br>Mientras hierve la pasta vamos preparando la salsa. Empezamos pochando a fuego lento la cebolla en aceite de oliva. La cebolla de estar bien picada en trocitos pequeños junto al diente de ajo.<br>Cuando la cebolla esté pochada le añadimos el tomate triturado, un poco de sal y el orégano. Se suele añadir un poco de azúcar para reducir la acidez del tomate. Lo dejamos en el fuego, removiéndolo de vez en cuando, durante unos 20 minutos.<br>En otra sartén salteamos las tiras de bacon hasta que queden doradas. Una vez doradas, las añadimos a la salsa.<br>Para terminar, cuando tengamos la pasta cocida la echamos a la sartén para mezclarla con la salsa. Concinamos durante unos minutos y ya tendríamos listos los macarrones con tomate.<br>Para servir, no hay que olvidarse de espolvorear queso parmesano por encima de los macarrones una vez emplatados.', '2024-01-02 11:12:11', 4, 2, 45, 'usuario1'),
(2, 'Arroz con carne', 'En una paella o sartén grande se pocha durante unos 20 minutos la cebolla y los pimientos picados en trozos finos.<br>A continuación se añade la carne de cerdo bien salpimentada y la doramos.<br>Una vez dorada la carne, añadimos el tomate frito, la salmorreta y el azafrán. Le damos unas vueltas para mezclarlo todo.<br>Ahora echamos el arroz y lo sofreímos durante unos minutos.<br>Por último añadimos el caldo de carne hasta cubrirlo todo y dejamos cocinarse al fuego durante otros 20 minutos.<br>Antes de servir dejamos reposar unos 5 minutos.', '2024-02-09 10:33:43', 6, 1, 60, 'usuario3'),
(3, 'Coca de hojaldre con chocolate', 'Primero se pone a calentar el horno a 180ºC. Mientras se calienta el horno se puede preparar el chocolate par el relleno de la coca. Para ello ponemos nata en un cazo a calentar. Cuando la nata esté caliente echamos el chocolate troceado. Ahora hay que remover con cuidado para que la nata no se queme, hasta que esté el chocolate deshecho.<br>\nCuando el chocolate está bien deshecho se retira del fuego y se deja enfriar un poco para que no esté tan líquido y se pueda rellenar mejor la coca.<br>\nA continuación ponemos una hoja de papel vegetal sobre la bandeja de horno y colocamos encima una lámina de hojaldre, que cubriremos con el chocolate.<br>\nAhora ponemos la otra lámina de hojaldre encima del chocolate y unimos las dos láminas por los bordes. Es conveniente pinchar con un tenedor la lámina de hojaldre para que no se hinche demasiado.<br>\nBatimos el huevo y con una brocha de cocina pintamos toda la masa de hojaldre, añadimos los piñones y espolvoreamos azúcar por toda la superficie de la coca.<br>\nMetemos la coca en el horno y en unos 20-30 minutos, dependiendo del horno, estará lista. Hay que tener cuidado para que no se queme el azúcar. Cuando la coca esté dorada significa que ya está lista.<br>\nCuando la saquemos del horno hay que dejarla enfriar un rato. Ya sólo queda servir y disfrutarla.', '2024-02-12 17:25:57', 4, 1, 45, 'usuario4'),
(4, 'Tortilla de patatas en freidora de aire', 'Empezamos pelando las patatas, cortándolas en rodajas finas y las colocamos en un bol para cubrirlas con agua. Deben estar unos 15 minutos a remojo para que suelten el almidón y queden más tiernas.<br>\r\nA continuación, se escurren bien las patatas para quitarles todo el agua y se colocan en el recipiente preparado para la freidora de aire. Se añaden una o dos cucharadas de aceite, un poco de sal y se mezcla todo.<br>\r\nSe pone la freidora de aire a 180ºC durante 30 minutos. Cada 10 minutos hay que abrir la freidora y remover un poco las patatas para que se vayan haciendo todas. Si fuera necesario, se puede alargar un poco el tiempo de freidora. Si te gusta la cebolla puedes añadirle una cebolla picada en trozos pequeños a los 15 minutos para que se cocine junto a las patatas.<br>\r\nUna vez tenemos las patatas cocidas, se baten los huevos en un bol y se añade un poco de sal y las patatas cocidas. Mezclamos todo bien.<br>\r\nAhora ponemos la mezcla en un recipiente apto para la freidora de aire y la metemos en la freidora de aire a 140ºC durante unos 10-12 minutos, hasta que esté cuajada a nuestro gusto. Podemos ir dándole vueltas para que se vaya haciendo igual por las dos caras.<br>\r\nCuando esté a nuestro gusto, la sacamos de la freidora y servimos.', '2024-02-12 17:26:20', 4, 1, 60, 'usuario5');

-- --------------------------------------------------------

--
-- Table structure for table `receta_etiqueta`
--

DROP TABLE IF EXISTS `receta_etiqueta`;
CREATE TABLE `receta_etiqueta` (
  `idReceta` int(11) NOT NULL,
  `idEtiqueta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receta_etiqueta`
--

INSERT INTO `receta_etiqueta` (`idReceta`, `idEtiqueta`) VALUES
(1, 1),
(1, 4),
(2, 2),
(2, 4),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(4, 10),
(4, 12);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `login` varchar(20) NOT NULL,
  `pwd` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(250) DEFAULT NULL,
  `ultimo_acceso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`login`, `pwd`, `email`, `token`, `ultimo_acceso`) VALUES
('usuario1', 'usuario1', 'usuario1@pcw.es', NULL, '2023-02-24 10:06:51'),
('usuario2', 'usuario2', 'usuario2@pcw.es', 'cda711a0d1fa50be272f2d16315ec02f5ca3aceaea98f267669c74bcf69e02e09a893ff26c7bc19ab95a70ba87897cb601278df5e69af3640544e224f6f500ce', '2024-01-29 16:44:05'),
('usuario3', 'usuario3', 'usuario3@pcw.es', NULL, '2023-04-28 11:00:26'),
('usuario4', 'usuario4', 'usuario4@pcw.es', NULL, '2024-02-09 09:48:47'),
('usuario5', 'usuario5', 'usuario5@pcw.es', NULL, '2024-02-12 08:06:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idReceta` (`idReceta`),
  ADD KEY `autor` (`autor`);

--
-- Indexes for table `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foto`
--
ALTER TABLE `foto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idReceta` (`idReceta`);

--
-- Indexes for table `ingrediente`
--
ALTER TABLE `ingrediente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idReceta` (`idReceta`);

--
-- Indexes for table `receta`
--
ALTER TABLE `receta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`);

--
-- Indexes for table `receta_etiqueta`
--
ALTER TABLE `receta_etiqueta`
  ADD PRIMARY KEY (`idReceta`,`idEtiqueta`),
  ADD KEY `idEtiqueta` (`idEtiqueta`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`login`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `foto`
--
ALTER TABLE `foto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `ingrediente`
--
ALTER TABLE `ingrediente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `receta`
--
ALTER TABLE `receta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`idReceta`) REFERENCES `receta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`autor`) REFERENCES `usuario` (`login`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `foto`
--
ALTER TABLE `foto`
  ADD CONSTRAINT `foto_ibfk_1` FOREIGN KEY (`idReceta`) REFERENCES `receta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ingrediente`
--
ALTER TABLE `ingrediente`
  ADD CONSTRAINT `ingrediente_ibfk_1` FOREIGN KEY (`idReceta`) REFERENCES `receta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `receta`
--
ALTER TABLE `receta`
  ADD CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuario` (`login`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `receta_etiqueta`
--
ALTER TABLE `receta_etiqueta`
  ADD CONSTRAINT `receta_etiqueta_ibfk_1` FOREIGN KEY (`idEtiqueta`) REFERENCES `etiqueta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `receta_etiqueta_ibfk_2` FOREIGN KEY (`idReceta`) REFERENCES `receta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
