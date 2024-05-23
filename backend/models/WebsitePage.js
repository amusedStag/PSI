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
        type: Number,
        default: 0
    },
    nErrorsAA: {
        type: Number,
        default: 0
    },
    nErrorsAAA: {
        type: Number,
        default: 0
    },
    errorCodes: {
        type: [String],
        default: []
    },
    nTestsPassed : {
        type: Number,
        default: 0
    },
    nTestsFailed : {
        type: Number,
        default: 0
    },
    nTestsWarning : {
        type: Number,
        default: 0
    },
    nTestsInapplicable : {
        type: Number,
        default: 0
    },
    tests: [
        {
            testName: String,
            testType: {
                type: String,
                enum: ['ACT Rule', 'WCAG Technique'],
            },
            testResult: {
                type: String,
                enum: ['passed', 'warning', 'failed', 'inapplicable'],
            },
            levels: {
                type: [String],
                default: []
            },
            elements: [
                {
                    element: String,
                    testResult: {
                        type: String,
                        enum: ['passed', 'warning', 'failed', 'inapplicable'],
                    },
                },
            ],
        },
    ],
});

const WebsitePage = mongoose.model('WebsitePage', websitePageSchema);

module.exports = WebsitePage;