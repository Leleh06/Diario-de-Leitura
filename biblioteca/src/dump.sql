CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE usuario(
id_user INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
nome VARCHAR(200) NOT NULL,
email VARCHAR(50) NOT NULL UNIQUE,
senha VARCHAR(12) NOT NULL
);

INSERT INTO usuario (nome,email,senha )
VALUES ("Leticya", "leticya_dias@lima123", "lele1234"),
('Heloisa','heloPianco@gmail.com','helo123');

DROP TABLE usuario;

CREATE TABLE livro (
id_livro INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
titulo VARCHAR (50) NOT NULL,
autor VARCHAR (100) NOT NULL,
categoria VARCHAR (50),
paginas INT,
tempo_leitura INT,
nota ENUM ("1","2","3","4","5"),
resenha VARCHAR(100),

id_user INT,
FOREIGN KEY (id_user)
REFERENCES usuario(id_user)
);

DROP TABLE livro;

INSERT INTO livro (id_user, titulo, autor, categoria, paginas, tempo_leitura, nota, resenha)
VALUES 
(1,'A Culpa é das Estrelas', 'John Green', 'Romance', 288, 6, '5', 'História emocionante e triste.'),
(1,'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Fantasia', 320, 8, '5', 'Início mágico de uma grande saga.');



CREATE TABLE likes (
 id_curtida INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
 id_user INT,
 id_livro INT,
 
  
FOREIGN KEY (id_user)
REFERENCES usuario (id_user),
    
    
FOREIGN KEY (id_livro)
REFERENCES livro (id_livro)
);


INSERT INTO likes (id_user, id_livro) VALUES (1, 1),(2, 2),(1, 2);


CREATE TABLE comentario (
 id_coment INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
 id_user INT,
 id_livro INT,
 

FOREIGN KEY (id_user)
REFERENCES usuario (id_user),
    

FOREIGN KEY (id_livro)
REFERENCES livro (id_livro)
  
  );

INSERT INTO comentario (id_user, id_livro) VALUES (1, 2),(2, 1),(2, 2);

SELECT * FROM livro
