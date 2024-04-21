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
        enum: ['Conforme', 'Não conforme'],
        required: true,
        default: 'Não conforme'
    }
});

const WebsitePage = mongoose.model('WebsitePage', websitePageSchema);

module.exports = WebsitePage;