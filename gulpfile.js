const gulp = require('gulp');
const { series } = require('gulp');
const fs = require('fs');
const path = require('path');
const glob = require("glob");
const inject = require('gulp-inject'); // append/prepend/wrap/before/after/beforeEach/afterEach/replace
const injectString = require('gulp-inject-string'); // append/prepend/wrap/before/after/beforeEach/afterEach/replace
const rename = require('gulp-rename'); // rename a file in stream
const flatten = require('gulp-flatten'); // remove from folders
const zip = require('gulp-zip'); // make a ZIP
const rimraf = require('rimraf'); // delete a folder that contains files

const templateFiles = glob.sync('./partial-templates/*.html'); // get list of partial templates from folder
const userPartialFiles = glob.sync('./src/partials/*.html'); // get list of partials from folder

const config680 = require('./config-680.json');
const config650 = require('./config-650.json');
const config600 = require('./config-600.json');
const config550 = require('./config-550.json');
const config500 = require('./config-500.json');

function defaultTask(cb) {

    gulp.watch([
        './src/**/*.*'
    ], buildForDistribution).on('end', function() {});

    cb();
}

/************************************************************************************
 * setup the basic project structure
 * @param cb
 */
function setup(cb) {
    // create partials folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/partials'));

    // create images folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/template'));

    // create dist folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./dist'));

    cb();
}


/*************************************************************************************
 * Create new partial
 * @param cb
 */
function partial(cb) {

    if (arg.n === undefined) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp partial --n "Partial name"');
        cb();
        return;
    }

    let partialName = userPartialFiles.length + '-' + arg.n.replace(/ /g, "-");
    let templateID = arg.t;

    // create partial folder for images
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/' + partialName))
        .on('end', function () {

            // insert partial inject into email template
            gulp.src('./src/template/*.html')
                .pipe(injectString.before('<!-- END: PARTIALS -->', '<!-- inject:../partials/' + partialName + '.html -->\n<!-- endinject -->\r\n\r\n'))
                .pipe(gulp.dest('./src/template'))
                .on('end', function () {

                    let templateName = null;

                    templateFiles.forEach(function (templateFile) {

                        let tmpName = path.basename(templateFile, '.html');

                        if (templateID === tmpName.charAt(0)) {
                            templateName = tmpName;
                        }
                    });

                    // create empty partial...
                    if (templateID === undefined || templateName === null) {
                        fs.writeFile('./src/partials/' + partialName + '.html', '<tr>\r\n    <td>[add your partial content here]</td>\r\n</tr>', cb);
                    }
                    else
                    // ...or duplicate an existing partial template
                    {
                        console.log("\x1b[31m%s\x1b[0m", '> Copying partial template: ', templateName + '.html');

                        gulp.src('./partial-templates/' + templateName + '.html')
                            .pipe(rename(function (path) {path.basename = partialName}))
                            .pipe(gulp.dest('./src/partials'))
                            .on('end', function () {

                                cb();
                            });
                    }
                });
        });
}


/*************************************************************************************
 * Build as single html file with partials embedded for browser-based testing
 * @param cb
 */
function buildForDistribution(cb) {

    let configToUse = config650;

    if (arg.s !== undefined) {
        configToUse = eval(arg.s);
        console.log("\x1b[31m%s\x1b[0m", 'Compiling using: "' + arg.s + '"');
    }

    rimraf('./dist', function () {  });

    setTimeout(function () {

        gulp.src('./src/template/*.html')
            .pipe(inject(gulp.src(['./src/partials/*.html']), {
                starttag: '<!-- inject:{{path}} -->',
                relative: true,
                transform: function(filepath, file) {
                    //console.log(filepath);
                    return file.contents.toString('utf8');
                }
            }))
            .pipe(gulp.dest('./dist'))
            .on('end', function () {

                gulp.src(['./src/images/**/*','!./src/images/**/*.psd'])
                    .pipe(flatten())
                    .pipe(gulp.dest('./dist/images/'))
                    .on('end', function () {

                        // replace all of the style tags from the config file
                        const stylesToReplace = Object.entries(configToUse);
                        const tasks = stylesToReplace.map((tag) => {
                            function replaceTags() {
                                return gulp.src('./dist/*.html')
                                    .pipe(injectString.replace('{{' + tag[0] + '}}', tag[1]))
                                    .pipe(gulp.dest('./dist'));
                            }
                            // Use function.displayName to make custom task name
                            replaceTags.displayName = 'replaceTag_' + tag[0];
                            return replaceTags;
                        });

                        return gulp.series(...tasks, (seriesDone) => {
                            seriesDone();
                            cb();
                        })();
                    });

            });

    }, 500)

}

function calCols(cb) {

    let MAX_WIDTH=680, CONTENT_MARGIN=20, CONTENT_MARGIN_NARROW=10, COL_PAD=20, COL1=0, COL_PAD_NARROW=14, tmp=null;

    COL1 = MAX_WIDTH - (CONTENT_MARGIN * 2);

    tmp = (MAX_WIDTH - COL_PAD) / 2;
    console.log("COL1_1_NO_MARGIN =", tmp);

    console.log("COL1 =", COL1);

    tmp = (COL1 - COL_PAD) / 2;
    console.log("COL1_1 =", tmp);

    tmp = (COL1 - (COL_PAD_NARROW * 2)) / 3;
    console.log("COL1_1_1 =", tmp);

    tmp = COL1 - ((COL1 - (COL_PAD_NARROW * 2)) / 3) - COL_PAD_NARROW;
    console.log("COL2_1 =", tmp);

    tmp = (COL1 - (COL_PAD_NARROW * 3)) / 4;
    console.log("COL1_1_1_1 =", tmp);

    tmp = CONTENT_MARGIN_NARROW + (COL1 - (COL_PAD_NARROW * 3)) / 4;
    console.log("COL1_1_1_1_NARROW =", tmp);

    tmp = (COL1 - COL_PAD_NARROW) - ((COL1 - (COL_PAD_NARROW * 3)) / 4);
    console.log("COL3_1 =", tmp);

    tmp = (COL1 - (COL_PAD_NARROW * 2)) - (((COL1 - (COL_PAD_NARROW * 3)) / 4) * 2);
    console.log("COL1_2_1 =", tmp);

    cb();
}


exports.default = defaultTask;

exports.setup = setup;

exports.partial = partial;

exports.calCols = calCols;

exports.dist = buildForDistribution;

// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt.replace(/([^a-z0-9_-]+)/gi, ' ').trim();
            curOpt = null;

        }
        else {

            // argument name
            curOpt = opt;
            arg[curOpt] = true;

        }

    }

    return arg;

})(process.argv);