'use strict';

var yeoman = require('yeoman-generator');
var helper = require('./../helper');
var chalk = require('chalk');
var path = require('path');

var ViewGenerator = yeoman.generators.NamedBase.extend({
  /**
   * INITIALIZING
   * Loads the projectConfig into the scope of the generator
   */
  initializing: function () {
    var done = this.async();
    this.projectConfig = helper.getProjectConfig();
    this.projectConfig.date = helper.getCreationDate();
    var scope = this;
    this.modules = helper.getModulesFromFileStructure(this, function () {
      scope.modules.splice(scope.modules.indexOf('common'), 1);
      done();
    });
  },
  prompting:    function () {
    var done = this.async();
    var prompts = [
      {
        type:    'string',
        name:    'description',
        message: 'Please describe your view.'
      },
      {
        type:    'string',
        name:    'modules',
        message: 'Enter your angular dependencies modules?'
      },
      {
        type:    'string',
        name:    'dependencies',
        message: 'Enter your dependencies injects?'
      },
      {
        type:    'list',
        name:    'chosenModule',
        message: 'Choose the location(modules) of your view: ',
        choices: this.modules,
        default: 0
      }
    ];

    this.prompt(prompts, function (props) {
      this.description = props.description;
      this.dependencies = props.dependencies;
      this.chosenModule = props.chosenModule || 'common';
      this.modules = props.modules;

      done();
    }.bind(this));
  },
  writing:      {
    /**
     * PROMPTS
     * Adds the answers of the user to the project config object
     */
    prompts:     function () {
      var done = this.async();
      this.projectConfig.prompts = {};
      this.projectConfig.prompts.description = this.description;
      this.projectConfig.prompts.dependencies = this.dependencies;
      this.projectConfig.prompts.modules = helper.buildModuleDependencies(this.modules);
      this.projectConfig.meta = helper.buildMetaInformations(this.name, this.chosenModule);

      this.projectConfig.meta.url = this.name.toLowerCase();
      var a = this.projectConfig.meta.url.split('/');
      if (a.length > 1) {
        var p = '', m = '', c = '';
        for (var i = 0; i < a.length; i++) {
          p += helper.firstCharToLowerCase(a[i]);
          m += helper.firstCharToLowerCase(a[i]);
          c += helper.firstCharToUpperCase(a[i]);

          if (i < a.length - 1) {
            p += '/';
            m += '.';
          }

        }
        this.projectConfig.meta.capitalizedName = c;
        this.projectConfig.meta.lowercaseName = helper.firstCharToLowerCase(c);
        this.projectConfig.meta.path = p;
        this.projectConfig.meta.fileName = helper.firstCharToUpperCase(a[a.length - 1]);
        this.projectConfig.meta.module = m;

      } else {
        this.projectConfig.meta.path = this.projectConfig.meta.module = this.projectConfig.meta.lowercaseName;
        this.projectConfig.meta.fileName = this.projectConfig.meta.capitalizedName;
      }

      done();
    },
    /**
     * DESTINATION
     * Defines the destination of our new files
     */
    destination: function () {

      var viewPath = path.join(
        this.projectConfig.path.srcDir,
        this.projectConfig.path.appDir,
        this.chosenModule,
        'views'
      );


      this.targetTemplate = path.join(
        viewPath,
        this.projectConfig.meta.lowercaseName + '.template.html'
      );

      this.targetScript = path.join(
        viewPath,
        this.projectConfig.meta.lowercaseName + '.controller.js'
      );
      this.projectConfig.meta.templateUrl = this.targetTemplate.replace('src/', '');

    },
    /**
     * TEMPLATE
     */
    template: function () {
      this.fs.copyTpl(
        this.templatePath('template'),
        this.destinationPath(this.targetTemplate),
        this.projectConfig
      );
    },
    /**
     * SCRIPT
     */
    script:      function () {
      this.fs.copyTpl(
        this.templatePath('script'),
        this.destinationPath(this.targetScript),
        this.projectConfig
      );
    }
    /**
     * TEST
     */
    //test:        function () {
    //}
  },
  end:          function () {
    console.log('');
    console.log(chalk.green('✔ ') + 'View ' + chalk.green(this.projectConfig.meta.capitalizedName) + ' created');
    console.log('');
  }
});
module.exports = ViewGenerator;
