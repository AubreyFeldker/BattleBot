export class BanRule {
    #database

    constructor(client, ruleName) {
        this.#database = client.bannedWords;
        this.name = ruleName.toUpperCase();

        const banRuleInfo = client.bannedWords.ensure(this.name, {
            rules: [], cleanedRules: [], lastWarn: Math.floor(Date.now() / 1000), lastWarnUser: '', totalWarns: 0
        });

        this.rules = banRuleInfo.rules;
        this.cleanedRules = banRuleInfo.cleanedRules.map((regex) => {return new RegExp(regex)});
        this.lastWarn = banRuleInfo.lastWarn;
        this.totalWarns = banRuleInfo.totalWarns;
    }

    // Cleans the rule's text and adds it to the rule list
    addRule(ruleText) {
        this.#database.push(this.name, ruleText, 'rules');
        let cleanedText = BanRule.cleanText(ruleText);

        cleanedText = cleanedText.replaceAll('a', '[a@]') 
            .replaceAll('s', '[s$]')
            .replaceAll(/[il]/g, '[il1]');

        this.#database.push(this.name, cleanedText, 'cleanedRules');
    }

    // Test if the provided string trips any of the rules
    test(string, user=null) {
        for (let i = 0; i < this.cleanedRules.length; i++) {
            if(this.cleanedRules[i].test(string) === true) {
                const prior = {lastWarn: this.lastWarn, lastWarnUser: this.lastWarnUser };
                this.#database.set(this.name, Math.floor(Date.now() / 1000), 'lastWarn');
                if (user) { this.#database.set(this.name, user, 'lastWarnUser'); }
                this.#database.inc(this.name, 'totalWarns');
                return prior;
            }
        }

        return null;
    }

    delete() {
        this.#database.delete(this.name);
    }

    static getAllRules(client) {
        const rules = Array.from(client.bannedWords.keys());
        return rules.map(ruleName => new BanRule(client, ruleName));
    }

    // turn all text lowercase and remove specific characters, including spaces
    static cleanText(text) {
        return text.toLowerCase().replaceAll(/[^a-z0-9\.\/:\+\=\&\@\$]+/g, '');
    }
}