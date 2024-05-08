const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');
const asyncHandler = require('express-async-handler');
const { websiteStatus, pageStatus } = require('../utils/evalUtils');
// importar avaliador do pacote
const { QualWeb, generateEARLReport } = require('@qualweb/core');

// o avaliador usa instâncias do browser Chrome para executar a avaliação
// definir as diferentes opções a usar
// plugins para bloquear anúncios e para que não seja detectado que o browser que está a ser usado em modo automático
const plugins = {
    adBlock: true, // Default value = false
    stealth: true // Default value = false
};
// o avaliador cria um cluster de páginas em avaliação
// definir o tempo que cada tab do browser vai esperar pelo fim do carregamento da página
const clusterOptions = {
    timeout: 60 * 1000, // Timeout for loading page. Default value = 30 seconds
};
// opções para lançamento do browser
const launchOptions = {
};

// criar instância do avaliador
const qualweb = new QualWeb(plugins);

exports.website_evaluate = asyncHandler(async (req, res) => {
    const websiteId = req.params.id;
    const { _id, url }  = req.body;

    try {
        const webpage = await WebsitePage.findById(_id);
        webpage.pageState = "Em avaliação";
        await webpage.save();

        const website = await Website.findById(websiteId);
        website.monitorState = websiteStatus(website);
        await website.save();


        await qualweb.start(clusterOptions, launchOptions);
        const qualwebOptions = {
            url: url
        };
        const report = await qualweb.evaluate(qualwebOptions);
        await qualweb.stop();
        console.log(report);

        const webpage2 = await WebsitePage.findById(_id);
        console.log(webpage2);
        webpage2.lastEvalDate = new Date();
        webpage2.lastEval = report;
        webpage2.pageState = pageStatus(webpage, report)
        await webpage2.save();

        const website2 = await Website.findById(websiteId);
        website2.monitorState = websiteStatus(website2);
        await website2.save();

        res.send(report);
    }
    catch (err) {
        console.error("Error evaluating website:", err);
        const webpage3 = await WebsitePage.findById(_id);
        webpage3.pageState = "Erro na avaliação";
        await webpage3.save();
        const website3 = await Website.findById(websiteId);
        website3.monitorState = websiteStatus(website3);
        await website3.save();
        res.status(500).json({ message: "Error evaluating website" });
    }
});