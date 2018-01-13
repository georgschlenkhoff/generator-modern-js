const Generator = require('yeoman-generator')
const superb = require('superb')
const _s = require('underscore.string')
const humanizedUrl = require('humanize-url')
const normalizeUrl = require('normalize-url')

module.exports = class extends Generator {

  init() {
    return this.prompt([{
      name: 'moduleName',
      message: 'Your project name',
      default: this.appname // Default to current folder name
    }, {
      name: 'moduleDescription',
      message: 'What is your module description?',
      default: `My ${superb()} module`

    }, {
      name: 'githubUsername',
      message: 'What is your  GitHub username?',
      store: true,
      validate: x => x.length > 0 ? true : 'You have to provide a username'
    }, {
      name: 'repoName',
      message: 'What is your repository name?',
      default: _s.slugify(this.appname)
    }, {
      name: 'website',
      message: 'What is the URL of your website?',
      store: true,
      validate: x => x.length > 0 ? true : 'You have to provide a website URL',
      filter: x => normalizeUrl(x)
    }]).then((answers) => {
      const tpl = {
        moduleName: answers.moduleName,
        moduleDescription: answers.moduleDescription,
        githubUsername: answers.githubUsername,
        repoName: answers.repoName,
        name: this.user.git.name(),
        email: this.user.git.email(),
        humanizedWebsite: humanizedUrl(answers.website),
        website: answers.website
      }

      const mv = (from, to) => {
        this.fs.move(this.destinationPath(from), this.destinationPath(to))
      }

      this.fs.copyTpl(
        `${this.templatePath()}/**`,
        this.destinationPath(),
        tpl
      )
      mv('_package.json', './package.json')
      mv('index.test.js', './test/index.test.js')
      mv('eslintrc.json', './.eslintrc.json')
      mv('babelrc', './.babelrc')
      mv('_flowconfig', './src/.flowconfig')
      mv('_README.md', './README.md')
      mv('_gitignore', './.gitignore')
      mv('index.js', './src/index.js')
      mv('npmrc', './.npmrc')
      mv('_travis.yml', './.travis.yml')

    })
  }

  install() {
    this.npmInstall([
      'babel-cli',
      'babel-eslint',
      'babel-preset-env',
      'chai',
      'documentation',
      'eslint',
      'eslint-plugin-flowtype',
      'flow-bin',
      'mocha',
      'nyc',
      'sinon'
    ], { 'save-dev': true })
  }

  git() {
    if (!this.options['skip-install']) {
      this.spawnCommandSync('git', ['init'])
    }
  }

}
