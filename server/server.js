const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Schema = mongoose.Schema;

app.use(cors());
app.use(bodyParser.json());
const dbURL = `mongodb://localhost:27017/reduxcrud`;

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log(`Database connected.`));

let gameSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            require: true
        },
        cover: {
            type: String,
            trim: true,
            require: true
        }
    },
    { timestamps: true }
);

const GameModel = mongoose.model('game', gameSchema);

app.get('/', (req, res) => {
    return res.json(`App is running at ${PORT}`);
})

app.get('/api/games', async (req, res) => {
    try {
        let infoGames = await GameModel.find();
        if (!infoGames) return res.json({ error: true, message: 'cannot_find_games' })
        return res.json({ error: false, data: infoGames })
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
})

app.post('/api/games', async (req, res) => {
    try {
        const { title, cover } = req.body;
        let infoGame = new GameModel({ title, cover });
        if (!infoGame) return res.json({ error: true, message: 'cannot_add_game' })
        let infoGameAfterSaved = await infoGame.save();
        return res.json({ error: false, data: infoGameAfterSaved })
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
})

app.get('/api/games/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        let infoGame = await GameModel.findById({ _id });
        if (!infoGame) return res.json({ error: true, message: 'cannot_find_game' })
        return res.json({ error: false, data: infoGame })
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
})

app.put('/api/games/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const { title, cover } = req.body;
        let infoGame = await GameModel.findByIdAndUpdate({ _id }, { title: title, cover: cover }, { new: true });
        if (!infoGame) return res.json({ error: true, message: 'cannot_update_game' })
        return res.json({ error: false, data: infoGame })
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
})

app.delete('/api/games/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        let infoGame = await GameModel.findByIdAndDelete({ _id });
        if (!infoGame) return res.json({ error: true, message: 'cannot_delete_game' })
        return res.json({ error: false, data: infoGame })
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));