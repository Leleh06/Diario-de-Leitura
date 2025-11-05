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

app.post("/livro", async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            "INSERT INTO livro (titulo, autor, categoria, paginas, tempo_leitura,nota) VALUES (?, ?, ?, ?, ?,?,?)",
            [
                body.titulo,
                body.autor,
                body.categoria,
                body.paginas,
                body.tempo_leitura,
                body.nota,
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

app.get("/livro", async (req, res) => {
    const { query } = req;
    const pagina = Number(query.pagina) - 1
    const quantidade = Number(query.quantidade)
    const offset = pagina * quantidade

    const [results] = await pool.query(`
    SELECT
    livro.id_livro,
    livro.titulo,
    livro.autor,
    livro.categoria,
    livro.paginas,
    livro.tempo_leitura,
    livro.nota,
    livro.nota,
    livro.id_user,
    (SELECT COUNT(*) FROM biblioteca.likes WHERE biblioteca.likes.id_livro = livro.id_livro) AS likes,
    (SELECT COUNT(*) FROM biblioteca.comentario WHERE biblioteca.comentario.id_livro = livro.id_livro) as qnt_comments
    FROM
    biblioteca.livro 
    left JOIN biblioteca.likes
    ON biblioteca.likes.id_livro = biblioteca.livro.id_livro
    LEFT JOIN biblioteca.comentario
    ON biblioteca.comentario.id_livro = biblioteca.livro.id_user
    LEFT JOIN biblioteca.usuario
    ON biblioteca.usuario.id_user = biblioteca.livro.id_user
    GROUP BY
    livro.id_livro,
    livro.titulo,
    livro.autor,
    livro.categoria,
    livro.paginas,
    livro.tempo_leitura,
    livro.nota,
    livro.nota,
    livro.id_user
    ORDER BY biblioteca.livro.id_livro asc
    LIMIT ?
    OFFSET ?
    `, [quantidade, offset]);
    res.send(results);
});



app.listen(3000, () => {
    console.log(`Servidor rodando na porta: http://localhost:3000`);
});