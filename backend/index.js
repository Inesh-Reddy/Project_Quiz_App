const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');
const { channel } = require('diagnostics_channel');
const prismaAccelerateUrl = process.env.PRISMA_ACCELERATE_URL;


const prisma = new PrismaClient({
    datasources: { db: { url: prismaAccelerateUrl } },
}).$extends(withAccelerate());

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.post("/create-question", async function(req, res) {
    const { text, choices, answerIndex } = req.body;

    try {
        const question = await prisma.question.create({
            data: {
                text,
                choices,
                answerIndex
            }
        });

        return res.json({
            qid: question.qid
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.get("/question", async function(req, res) {
    const { qid } = req.body;
    try{
        const question = await prisma.question.findFirst({
            where:{
                qid:qid
            }
        });
        return res.json({
            question: question.text,
            choise: question.choices

        })
    }catch(error){
        console.log("error fetching question:", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
    res.send("Server is running!");
});

app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
