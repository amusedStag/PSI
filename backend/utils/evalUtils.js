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

    let act_rules = report[url].modules['act-rules']; //ou metadata geral?
    webpage.nTestsFailed = webpage.nTestsFailed + act_rules.metadata.failed;
    webpage.nTestsPassed = webpage.nTestsPassed + act_rules.metadata.passed;
    webpage.nTestsWarning = webpage.nTestsWarning + act_rules.metadata.warning;
    webpage.nTestsInapplicable = webpage.nTestsInapplicable + act_rules.metadata.inapplicable;

    let wcag_techniques = report[url].modules['wcag-techniques'];
    webpage.nTestsFailed = webpage.nTestsFailed + wcag_techniques.metadata.failed;
    webpage.nTestsPassed = webpage.nTestsPassed + wcag_techniques.metadata.passed;
    webpage.nTestsWarning = webpage.nTestsWarning + wcag_techniques.metadata.warning;
    webpage.nTestsInapplicable = webpage.nTestsInapplicable + wcag_techniques.metadata.inapplicable;

    let act_rules_assertions = report[url].modules['act-rules'].assertions;
    let wcag_assertions = report[url].modules['wcag-techniques'].assertions;
    let hasAorAAerror = false;

    for (let act_rule in act_rules_assertions) {
        const rule = act_rules_assertions[act_rule];
        let metadata = rule.metadata;
        let isAorAA = false;
        for (let success of metadata['success-criteria']) {
            if (success.level === 'A') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsA = webpage.nErrorsA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AA') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAA = webpage.nErrorsAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AAA') {
                if (metadata.outcome === 'failed') {
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
        let rule = wcag_assertions[wcag];
        let metadata = rule.metadata;
        let isAorAA = false;
        for (let success of metadata['success-criteria']) {
            if (success.level === 'A') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsA = webpage.nErrorsA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AA') {
                isAorAA = true;
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAA = webpage.nErrorsAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            } else if (success.level === 'AAA') {
                if (metadata.outcome === 'failed') {
                    webpage.nErrorsAAA = webpage.nErrorsAAA + metadata.failed;
                    webpage.errorCodes.push(rule.code);
                }
            }
        }
        if (isAorAA && metadata.outcome === 'failed') {
            hasAorAAerror = true;
        }
    }

    for (let act_rule in act_rules_assertions) {
        const rule = act_rules_assertions[act_rule];
        let metadata = rule.metadata;

        let evaluatedElements = [];

        for (let result of rule.results) {
            let elem = result.elements[0]
                evaluatedElements.push({
                element: elem.pointer,
                testResult: result.verdict,
            });
        }

        let conformanceLevels = [];
        for (let success of metadata['success-criteria']) {
            conformanceLevels.push(success.level);
        }
        // only push if it's not inapplicable?
        webpage.tests.push({
            testName: rule.name,
            testType: 'ACT Rule',
            testResult: metadata.outcome,
            levels: conformanceLevels,
            elements: evaluatedElements,
        });
    }

    for (let wcag_rule in wcag_assertions) {
        const rule = wcag_assertions[wcag_rule];
        let metadata = rule.metadata;

        let evaluatedElements = [];

        for (let result of rule.results) {
            if (result.elements && result.elements.length > 0) {
                let elem = result.elements[0];
                evaluatedElements.push({
                    element: elem.pointer,
                    testResult: result.verdict,
                });
            }
        }

        let conformanceLevels = [];
        for (let success of metadata['success-criteria']) {
            conformanceLevels.push(success.level);
        }

        // only push if it's not inapplicable?
        webpage.tests.push({
            testName: rule.name,
            testType: 'WCAG Technique',
            testResult: metadata.outcome,
            levels: conformanceLevels,
            elements: evaluatedElements,
        });
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