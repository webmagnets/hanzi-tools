let { pinyinify, simplify, traditionalize } = require("../index");

let customMatchers = {
    becomes: function (util, customTesters) {
        return {
            compare: (input, expected) => {
                var result = {};
                var actual = pinyinify(input);
                result.pass = util.equals(actual, expected, customTesters);
                if (!result.pass) result.message = `Expected: ${expected}\n Actual: ${actual}.`;
                return result;
            }
        };
    }
};

describe("Pinyinify", () => {
    beforeEach(function () {
        jasmine.addMatchers(customMatchers);
    });

    it("works on very simple input", () => {
        expect("好").becomes("hǎo");
        expect("妈").not.becomes("mǎ");
    });

    it("selects the correct pronunciation for 多音字", () => {
        expect("我受不了了").becomes("wǒ shòu​bù​liǎo le");
        expect("我觉得睡觉是很重要的。我睡了一个好觉有很好的感觉。").becomes("wǒ jué​de shuì​jiào shì hěn zhòng​yào de. wǒ shuì le yī gè hǎo jiào yǒu hěn hǎo de gǎn​jué.");
        expect("你看她干吗？她是你的女朋友吗？").becomes("nǐ kàn tā gàn​má? tā shì nǐ de nǚ​péng​you ma?");
        expect("他给我发了个短信：“我长大的时候我的头发很长。但是现在我喜欢理发。”").becomes("tā gěi wǒ fā le gè duǎn​xìn: ``wǒ zhǎng​dà de shí​hou wǒ de tóu​fa hěn cháng. dàn​shì xiàn​zài wǒ xǐ​huan lǐ​fà.\"");
        expect("我们都想去首都玩。").becomes("wǒ​men dōu xiǎng qù shǒu​dū wán.");
        expect("不要应该睡觉时不睡觉。").becomes("bù​yào yīng​gāi shuì​jiào shí bù shuì​jiào.");
    });

    it("converts punctuation and spacing", () => {
        expect("什么？！我绝对 不 想 去！！你问我“你想去吗”干吗 不要问我了。哎哟（哈哈）晚安~")
            .becomes("shén​me?! wǒ jué​duì  bù  xiǎng  qù!! nǐ wèn wǒ ``nǐ xiǎng qù ma\" gàn​má  bù​yào wèn wǒ le. āi​yō (hā​hā) wǎn​ān~");
    });

    it("doesn't mangle numbers or non-Chinese text", () => {
        expect("我有2个。他有540！50%的意思是百分之五十。").becomes("wǒ yǒu 2 gè. tā yǒu 540! 50% de yì​si shì bǎi​fēn​zhī wǔ​shí.");
        expect("我叫Dr. Smith。他是Señor López。他是Владимир Влидимирович给我们介绍的。", "wǒ jiào Dr. Smith. tā shì Señor López. tā shì Владимир Влидимирович gěi wǒmen jièshào de.");
    });

    it("returns detailed output when given a second parameter", () => {
        let details = pinyinify("他们为什么没有这样做？这真是他所想要的吗？", true);
        expect(details.segments).toEqual(['他们', '为什么', '没有', '这样', '做', '？', '这', '真是', '他', '所', '想要', '的', '吗', '？']);
        expect(details.pinyinSegments).toEqual(['tā​men', 'wèi​shén​me', 'méi​yǒu', 'zhè​yàng', 'zuò', '?', 'zhè', 'zhēn​shi', 'tā', 'suǒ', 'xiǎng​yào', 'de', 'ma', '?']);
        expect(details.pinyinSegmentsSyllables).toEqual([['tā', 'men'],
        ['wèi', 'shén', 'me'],
        ['méi', 'yǒu'],
        ['zhè', 'yàng'],
        ['zuò'],
        ['?'],
        ['zhè'],
        ['zhēn', 'shi'],
        ['tā'],
        ['suǒ'],
        ['xiǎng', 'yào'],
        ['de'],
        ['ma'],
        ['?']]);
        expect(details.pinyin).toEqual('tā​men wèi​shén​me méi​yǒu zhè​yàng zuò? zhè zhēn​shi tā suǒ xiǎng​yào de ma?');


        details = pinyinify("我们是五个太好的门。", true);
        expect(details.pinyinSegmentsSyllables).toEqual([['wǒ', 'men'],
        ['shì'],
        ['wǔ'],
        ['gè'],
        ['tài'],
        ['hǎo'],
        ['de'],
        ['mén'],
        ['.']]);
    });
});

describe("Simplify", () => {
    it("works on simple input", () => {
        expect(simplify("犬（學名：Canis lupus familiaris）[1]，現代俗稱為狗，一種常見的犬科哺乳動物，與狼為同一種動物，生物學分類上是狼的一個亞種。狗是人類最早馴養的一個物種。被人養的稱為家犬，返回野外沒人養的狗稱為「野狗」或「流浪狗」，是會造成各種問題的。犬的壽命最多可達二十多年，平均則為十數年，與貓的平均壽命相近。若無發生意外，平均壽命以小型犬為長。"))
            .toEqual("犬（学名：Canis lupus familiaris）[1]，现代俗称为狗，一种常见的犬科哺乳动物，与狼为同一种动物，生物学分类上是狼的一个亚种。狗是人类最早驯养的一个物种。被人养的称为家犬，返回野外没人养的狗称为「野狗」或「流浪狗」，是会造成各种问题的。犬的寿命最多可达二十多年，平均则为十数年，与猫的平均寿命相近。若无发生意外，平均寿命以小型犬为长。");
        expect(simplify("為爲为昰是哪裏哪裡")).toEqual("为为为是是哪里哪里");
    });
});

describe("Traditionalize", () => {
    it("works on simple input", () => {
        expect(traditionalize("旧石器时代（英语：Paleolithic age）是石器时代的早期阶段，一般划定此时期为距今约260万年[1]或250万年[2]（能人首次制造出石器）至1.2万年前[3][4]（农业文明的出现）。地质时代属于上新世晚期至更新世。其时期划分一般采用三分法，即旧石器时代早期、中期和晚期，大体上分别对应于人类体质进化的能人和直立人阶段、早期智人阶段、晚期智人阶段。旧石器时代之后为中石器时代[5]。"))
            .toEqual("舊石器時代（英語：Paleolithic age）是石器時代的早期階段，一般劃定此時期為距今約260萬年[1]或250萬年[2]（能人首次製造出石器）至1.2萬年前[3][4]（農業文明的出現）。地質時代屬於上新世晚期至更新世。其時期劃分一般採用三分法，即舊石器時代早期、中期和晚期，大體上分別對應於人類體質進化的能人和直立人階段、早期智人階段、晚期智人階段。舊石器時代之後為中石器時代[5]。");
        expect(traditionalize("为为为是是哪里哪里")).toEqual("為為為是是哪裡哪裡");
    });
});