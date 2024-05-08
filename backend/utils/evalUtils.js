const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');

function websiteStatus(website) {
    //let hasPorAvaliar = false;
    //let hasEmAvaliacao = false;
    let allConformeOrNaoConforme = false;
    let hasErroNaAvaliacao = false;

    for (let page of website.webpages) {
        if (page.pageState === 'Erro na avaliação') {
            hasErroNaAvaliacao = true;
            break;
        }
    }
    website.webpages.every( (page) => {
        page.pageState === 'Conforme' || page.pageState === 'Não conforme' ? allConformeOrNaoConforme = true : allConformeOrNaoConforme = false;
    })

    if (hasErroNaAvaliacao) {
        return 'Erro na avaliação';
    } else if (allConformeOrNaoConforme) {
        return 'Avaliado';
    } else {
        return 'Em avaliação';
    }
}

function pageStatus(webpage, report) {
    let url = webpage.url;
    let act_rules_assertions = report[url].modules['act-rules'].assertions;
    let wcag_assertions = report[url].modules['wcag-techniques'].assertions;
    let hasAorAAerror = false;

    for (let act_rule of act_rules_assertions) {
        const rule = act_rules_assertions[act_rule];
        let metadata = rule.metadata;
        let isAorAA = false;
        for (let success of metadata['success-criteria']) {
            if (success.level === 'A') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsA++;
                    webpage.errorCodes.push(rule.code);
                }
            }
            else if (success.level === 'AA') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAA++;
                    webpage.errorCodes.push(rule.code);
                }
            }
            else if (success.level === 'AAA') {
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAAA++;
                    webpage.errorCodes.push(rule.code);
                }
            }
        }
        if (isAorAA && metadata.outcome === 'failed') {
            hasAorAAerror = true;
        }
    }
    for (let wcag of wcag_assertions) {
        let rule = wcag_assertions[wcag];
        let metadata = rule.metadata;
        let isAorAA = false;
        for (let success of metadata['success-criteria']) {
            if (success.level === 'A') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsA++;
                    webpage.errorCodes.push(rule.code);
                }
            }
            else if (success.level === 'AA') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAA++;
                    webpage.errorCodes.push(rule.code);
                }
            }
            else if (success.level === 'AAA') {
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAAA++;
                    webpage.errorCodes.push(rule.code);
                }
            }
        }
        if (isAorAA && metadata.outcome === 'failed') {
            hasAorAAerror = true;
        }
    }
    if (hasAorAAerror) {
        return 'Não conforme';
    } else {
        return 'Conforme';
    }
}


module.exports = {
    websiteStatus,
    pageStatus
};