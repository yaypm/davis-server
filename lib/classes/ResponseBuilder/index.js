'use strict';

const nunjucks = require('./nunjucks');
const fs = require('fs');

const NUNJUCK_EXTENSION = '.nj',
    RESERVED_FOLDER_NAMES = {
        say: ['audible', 'say'],
        show: ['visual', 'show']
    };

class ResponseBuilder {
    constructor(davis) {
        this.davis = davis;
        this.greeter = new Greeter(davis);
    }

    randomNunjuckTemplate(templatePath, files) {
        const filteredTemplateList = _.filter(files, file => _.endsWith(file, NUNJUCK_EXTENSION));

        if (filteredTemplateList.length === 0) {
            this.davis.logger.error('Unable to find a template');
            return new this.davis.Error('Unable to find template.');
        } else {
            return path.join(templatePath, _.sample(filteredTemplateList));
        }
    }

    findAdditionalTemplates(templatePath, files, reserved_folders) {
        const matches = _.intersection(files, reserved_folders);
        if (_.isEmpty(matches)) return;

        const folder = _.head(matches);

        const newFiles = fs.readdirSync(templatePath);
        if (files.length === 0) {
            this.davis.logger.warn(`Template directory exists, but is empty: ${relativeTemplatePath}/${matches[0]}`)
            return null;
        }

        return randomNunjuckTemplate(templatePath, folder, newFiles);
    }

    createSlackCard(text) {
        return { text };
    }

    build(exchange, templateDir) {
        try {
            const files = fs.readdirSync(path.normalize(templateDir));

            const templates  = _.omitBy({
                say: this.findAdditionalTemplates(templateDir, files, RESERVED_FOLDER_NAMES.say),
                text: this.randomNunjuckTemplate(templateDir, files),
                show: this.findAdditionalTemplates(templateDir, files, RESERVED_FOLDER_NAMES.show),
            }, _.isNil);

            const response = _.mapValues(templates, template =>
                nunjucks(this.davis.config.aliases).render(template, exchange.getContext())
            );

            try {
                response.show = (response.show) ? JSON.parse(response.show) : { text: response.text };
            } catch(err) {
                this.davis.logger.warn("The show response wasn't valid JSON. Processing as text.");
                response.show = this.createSlackCard(text);
            }

            return response;
        } catch(err) {
            this.davis.logger.error(`Unable to get templates: ${err.message}`);
            throw err;
        }
    }
}

module.exports = ResponseBuilder;
