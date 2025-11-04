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
                    body.livro,
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

    // app.get("/livro", async (req, res) => {
    //     const { query } = req;
    //     const pagina = Number(query.pagina) - 1
    //     const quantidade = Number(query.quantidade)
    //     const offset = pagina * quantidade
      
    //     const [results] = await pool.query(`
    //       SELECT
    //         livro.id_livro,
    //         livro.categoria,
    //         livro.horas_trabalhadas,
    //         livro.linhas_codigo,
    //         livro.bugs_corrigidos,
    //         livro.id_user,
    //         (SELECT COUNT(*) FROM devhub.like WHERE devhub.like.id_log = livro.id) AS likes,
    //         (SELECT COUNT(*) FROM devhub.comment WHERE devhub.comment.id_log = livro.id) as qnt_comments
    //       FROM
    //         devhub.livro 
    //       left JOIN devhub.like
    //       ON devhub.like.id_log = devhub.livro.id
    //       LEFT JOIN devhub.comment
    //       ON devhub.comment.id_log = devhub.livro.id
    //       LEFT JOIN devhub.usuario
    //       ON devhub.usuario.id = devhub.livro.id_user
    //       GROUP BY
    //       livro.id,
    //         livro.categoria,
    //         livro.horas_trabalhadas,
    //         livro.linhas_codigo,
    //         livro.bugs_corrigidos,
    //         livro.id_user
    //       ORDER BY devhub.livro.id asc
    //         LIMIT ?
    //         OFFSET ?
    //       `, [quantidade, offset]);
    //     res.send(results);
    //   });
      


    app.listen(3000, () => {
        console.log(`Servidor rodando na porta: http://localhost:3000`);
    });