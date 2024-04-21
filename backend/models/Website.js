const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastEvalDate: {
        type: Date
    },
    monitorState: {
        type: String,
        enum: ['Por avaliar', 'Em avaliação', 'Avaliado', 'Erro na avaliação'],
        required: true,
        default: 'Por avaliar'
    },
    webpages: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WebsitePage'
        }],
        default: [],
        required: true
    }
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;