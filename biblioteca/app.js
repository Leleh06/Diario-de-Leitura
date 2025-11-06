import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
const pool = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "senai",
    database: "biblioteca",
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Olá Mundo");
});

app.get("/usuario", async (req, res) => {
    const [results] = await pool.query("SELECT * FROM usuario");
    res.send(results);
});

app.get("/usuario/:id", async (req, res) => {
    const { id } = req.params;
    const [results] = await pool.query(
        "SELECT * FROM usuario WHERE id=?",
        id
    );
    res.send(results);
});

app.post("/usuario", async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            "INSERT INTO usuario (nome, email, senha) VALUES (?,?,?)",
            [body.nome, body.email, body.senha]
        );

        const [usuarioCriado] = await pool.query(
            "Select * from usuario WHERE id_user=?",
            results.insertId
        );

        return res.status(201).json(usuarioCriado);
    } catch (error) {
        console.log(error);
    }
});

app.delete("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            "DELETE FROM usuario WHERE id_user=?",
            id
        );
        res.status(200).send("Usuário deletado!", results);
    } catch (error) {
        console.log(error);
    }
});

app.put("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const [results] = await pool.query(
            "UPDATE usuario SET `nome` = ?, `senha` = ? WHERE id_user= ?; ",
            [body.nome, body.senha, id]
        );
        res.status(200).send("Usuario atualizado", results);
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    try {
      const { body } = req;
  
      const [usuario] = await pool.query(
        "Select * from usuario WHERE email=? and senha=?",
        [body.email, body.senha]
      );
  
      if (usuario.length > 0) {
        return res.status(200).json({
          message: "Usuario logado",
          dados: usuario,
        });
      } else {
        return res.status(404).send("Email ou senha errados!");
      }
    } catch (error) {
      console.log(error);
    }
  });


// Livro

app.post("/livro", async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            "INSERT INTO livro ( titulo, autor, categoria, paginas, tempo_leitura, nota, resenha) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                body.titulo,
                body.autor,
                body.categoria,
                parseInt(body.paginas),
                parseInt(body.tempo_leitura),
                parseInt(body.nota),
                body.resenha,
            ]
        );
        const [livroAdicionado] = await pool.query(
            "SELECT * FROM livro WHERE id_livro=?",
            results.insertId
        );
        res.status(201).json(livroAdicionado);
    } catch (error) {
        console.log(error);
    }
});

app.get("/livro", (req, res) => {
    const [results] = pool.query("SELECT * FROM livro");
    res.send(results);
});



app.listen(3000, () => {
    console.log(`Servidor rodando na porta: http://localhost:3000`);
});