-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 20-Set-2024 às 09:01
-- Versão do servidor: 5.7.36
-- versão do PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `teste-vocacional`
--
CREATE DATABASE IF NOT EXISTS `teste-vocacional` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `teste-vocacional`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `curso`
--

DROP TABLE IF EXISTS `curso`;
CREATE TABLE IF NOT EXISTS `curso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `instituicao` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`(20)),
  KEY `fk_usuario` (`instituicao`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `curso`
--

INSERT INTO `curso` (`id`, `codigo`, `descricao`, `instituicao`) VALUES
(11, 'TESTE752', 'teste', 'Fatec'),
(10, 'ASASA460', 'asasas', 'Etec'),
(9, 'TESTE475', 'teste', 'Etec'),
(8, 'TESTE117', 'teste', 'Fatec'),
(12, 'HGHGH115', 'hghghghg', 'Etec');

-- --------------------------------------------------------

--
-- Estrutura da tabela `dadosusuarios`
--

DROP TABLE IF EXISTS `dadosusuarios`;
CREATE TABLE IF NOT EXISTS `dadosusuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `ddd` int(2) NOT NULL,
  `celular` int(9) NOT NULL,
  `respostaTeste` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_respostaTeste` (`respostaTeste`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pergunta`
--

DROP TABLE IF EXISTS `pergunta`;
CREATE TABLE IF NOT EXISTS `pergunta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `primeira` varchar(100) NOT NULL,
  `segunda` varchar(100) NOT NULL,
  `terceira` varchar(100) NOT NULL,
  `quarta` varchar(100) NOT NULL,
  `quinta` varchar(100) NOT NULL,
  `curso` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pergunta_curso` (`curso`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `pergunta`
--

INSERT INTO `pergunta` (`id`, `primeira`, `segunda`, `terceira`, `quarta`, `quinta`, `curso`) VALUES
(8, 'pergunta1', 'pergunta2', 'pwegunta3', 'pergunta4', 'pergunta5', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `usuario` varchar(50) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(10) NOT NULL,
  `nivelAcesso` int(1) NOT NULL,
  `instituicao` varchar(5) NOT NULL,
  `curso` int(11) DEFAULT NULL,
  PRIMARY KEY (`usuario`),
  KEY `fk_usuario_curso` (`curso`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`usuario`, `nome`, `email`, `senha`, `nivelAcesso`, `instituicao`, `curso`) VALUES
('admin2', 'Administrador Geral Etec', 'teste@teste.com', '123', 1, 'Etec', 0),
('admin', 'Administrador Geral Fatec', 'analauraalmeidaventura@gmail.com', '123', 1, 'Fatec', 0),
('José Maria', 'José Maria', 'josemaria@gmail.com', '123', 2, 'Fatec', 5);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
