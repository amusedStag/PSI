const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');

function websiteStatus(website) {
    let allConformeOrNaoConforme = true;
    let allPorAvaliar = true;
    let hasErroNaAvaliacao = false;

    if (website.webpages.length === 0) {
        return 'Por avaliar';
    }

    for (let page of website.webpages) {
        console.log(page.pageState);
        if (page.pageState === 'Erro na avaliação') {
            hasErroNaAvaliacao = true;
            break;
        }
        if (page.pageState !== 'Conforme' && page.pageState !== 'Não conforme') {
            allConformeOrNaoConforme = false;
        }
        if (page.pageState !== 'Por avaliar') {
            allPorAvaliar = false;
        }

    }
    // website.webpages.every( (page) => {
    //     page.pageState === 'Conforme' || page.pageState === 'Não conforme' ? allConformeOrNaoConforme = true : allConformeOrNaoConforme = false;
    // })
    //
    // console.log(allConformeOrNaoConforme);
    // console.log(hasErroNaAvaliacao);

    if (hasErroNaAvaliacao) {
        return 'Erro na avaliação';
    } else if (allConformeOrNaoConforme) {
        return 'Avaliado';
    } else if (allPorAvaliar) {
        return 'Por avaliar';
    } else {
        return 'Em avaliação';
    }
}

async function pageStatus(webpage, report) {
    let url = webpage.url;
    let act_rules_assertions = report[url].modules['act-rules'].assertions;
    let wcag_assertions = report[url].modules['wcag-techniques'].assertions;
    let hasAorAAerror = false;

    for (let act_rule in act_rules_assertions) {
        //console.log("ACT_RULE IS " + act_rule);
        const rule = act_rules_assertions[act_rule];
        //console.log("RULE IS " + rule);
        let metadata = rule.metadata;
        //console.log("METADATA IS " + metadata);
        // console.log("metadata.failed is " + metadata.failed);
        // console.log("with type " + typeof metadata.failed);
        // console.log("isNaN(webpage.nErrorsA): " + isNaN(webpage.nErrorsA));
        let isAorAA = false;
        for (let success of metadata['success-criteria']) {
            //console.log("SUCCESS IS " + success);
            if (success.level === 'A') {
                //console.log("in level A if");
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    //console.log("in failed if in level A if");
                    webpage.nErrorsA = webpage.nErrorsA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AA') {
                //console.log("in level AA if");
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    //console.log("in failed if in level AA if");
                    webpage.nErrorsAA = webpage.nErrorsAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AAA') {
                //console.log("in level AAA if");
                if (metadata.outcome === 'failed') {
                    //console.log("in failed if in level AAA if");
                    webpage.nErrorsAAA = webpage.nErrorsAAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            }
        }
        if (isAorAA && metadata.outcome === 'failed') {
            hasAorAAerror = true;
        }
    }
    for (let wcag in wcag_assertions) {
        //console.log("WCAG IS " + wcag);
        let rule = wcag_assertions[wcag];
        //console.log("RULE IS " + rule);
        let metadata = rule.metadata;
        //console.log("METADATA IS " + metadata);
        //console.log("metadata.failed is " + metadata.failed);
        //console.log("with type" + typeof metadata.failed);

        let isAorAA = false;
        for (let success of metadata['success-criteria']) {
            //console.log("SUCCESS IS " + success);
            if (success.level === 'A') {
                //console.log("in level A if");
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    //console.log("in failed if in level A if");
                    webpage.nErrorsA = webpage.nErrorsA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AA') {
                //console.log("in level AA if");
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    //console.log("in failed if in level AA if");
                    webpage.nErrorsAA = webpage.nErrorsAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AAA') {
                //console.log("in level AAA if");
                if (metadata.outcome === 'failed') {
                    //console.log("in failed if in level AAA if");
                    webpage.nErrorsAAA = webpage.nErrorsAAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            }
        }
        if (isAorAA && metadata.outcome === 'failed') {
            hasAorAAerror = true;
        }
    }

    await webpage.save();

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