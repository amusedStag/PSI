const mongoose = require('mongoose');

const websitePageSchema = new mongoose.Schema({
    website: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    lastEvalDate: {
        type: Date
    },
    pageState: {
        type: String,
        enum: ['Conforme', 'Não conforme', 'Por avaliar', 'Em avaliação', 'Erro na avaliação'],
        required: true,
        default: 'Por avaliar'
    },
    lastEval: {
        type: mongoose.Schema.Types.Mixed
    },
    nErrorsA: {
        type: Number
    },
    nErrorsAA: {
        type: Number
    },
    nErrorsAAA: {
        type: Number
    },
    errorCodes: {
        type: [String]
    }
    //nErrorsA number, nErrorsAA number, nErrorsAAA number, errorCodes [String]
});

const WebsitePage = mongoose.model('WebsitePage', websitePageSchema);

module.exports = WebsitePage;