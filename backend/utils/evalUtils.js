const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');

function websiteStatus(website) {
    let hasPorAvaliar = false;
    let hasEmAvaliacao = false;
    let hasConformeOrNaoConforme = false;
    let hasErroNaAvaliacao = false;

    for (let page of website.webpages) {
        switch (page.pageState) {
            case 'Por avaliar':
                hasPorAvaliar = true;
                break;
            case 'Em avaliação':
                hasEmAvaliacao = true;
                break;
            case 'Conforme':
            case 'Não conforme':
                hasConformeOrNaoConforme = true;
                break;
            case 'Erro na avaliação':
                hasErroNaAvaliacao = true;
                break;
        }
    }

    if (hasErroNaAvaliacao) {
        return 'Erro na avaliação';
    } else if (hasPorAvaliar || hasEmAvaliacao) {
        if (hasConformeOrNaoConforme && !hasErroNaAvaliacao) {
            return 'Em avaliação';
        } else {
            return 'Por avaliar';
        }
    } else if (hasConformeOrNaoConforme) {
        return 'Avaliado';
    } else {
        return 'Por avaliar';
    }
}


module.exports = {
    websiteStatus
};