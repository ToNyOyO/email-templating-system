```diff
- DO NOT BORK MY REPO 
+ Press the *Use this template* button
``` 

# Email templating system

> This tool is designed to help streamline the building of emails with pre-existing layout blocks ("partials"; i.e. 1-col, 2-col, header image, etc.). 
> 
> This tool will provide you with a simple way to view the email template in a browser, with all your chosen partials included.  
>
> You can also add dynamic styles for fonts and colors etc. so that they can be controlled from a central config file. 

*FYI: If you need to paste it into Outlook, then you'll need to open the template directly from Windows, and  not via PhpStorm.*

## Quick start...

- Press the big green __Use this template__ button to create a new repo from these files  
- Run `npm install`
- Run `gulp setup`
- Then start creating your partials:
  - Run `gulp partial --n "Partial Name" --t a` for each partial you want to create
    - Sensible names please, no silly characters
    - Use the partial-template's single character ID to import the partial-template html into your partial 

> All new partials added by you will be hyphenated where you have spaces, and will also have a unique id number added to the start, e.g. `5-partial-name`. This is to stop you overwriting your existing partials by accident. The id means nothing. 

- [How to configure your template styles](#Adding-dynamic-stylescontent).

- [Examples of the existing partial-templates](#Current-partial-options). 

- [Gulp Tasks](#Gulp-Tasks-and-Workflow). 

## File structure

You'll need to make the following folder structure which can be done by running `gulp setup`: 

```
root/
|—— dist/
|—— partial-templates/
|—— src/
|   |—— partials/
|   |—— images/
|   |—— template/
|
|—— config500.json
|—— config550.json
|—— config600.json
|—— config650.json
|—— gulfile.js
|—— package.json
```

The `template` folder will contain your email template. It doesn't matter what your `html` file is called. 

Each partial needs to go in `partials`. You should give your partial `html` files sensible, relevant names. Please, no funny characters: Stick to alphanumeric. 

You can define dynamic content in `config[n].json`. Any dynamic content needs to be encapsulated with `{{}}` and technically this is for styles but could actually be used for any content. 

# Gulp Tasks and Workflow

Menu | Gulp task | Action
---- |--------- | ------
[Read](#Watch) | `$ gulp` | Watch the `src` folder for changes and autorun `dist`
[Read](#Setup) | `$ gulp setup` | Setup the project folder structure
[Read](#Partials) | `$ gulp partial --n "Partial name" --t id` | Create a new partial (optionally you can add the template id (a, b, ...k)
[Read](#Calculate-columns) | `$ gulp calCols` | A quality-of-life tool to calculate column sizes for your config file 
[Read](#Distribution) | `$ gulp dist` | Deploy task - compiles the template
[Read](#Distribution) | `$ gulp dist --s "config550"` | Deploy task but using an alternative config file

# Watch
```
$ gulp
```
Watch the `partials`, `images`, and `template` files for changes and run the `build` command automatically. 

You may like to implement something to refresh your browser when this command runs but I prefer to press F5 myself. Here's an example of how to implement a live reload if that's what you're into: <https://stackoverflow.com/questions/43415506/how-to-make-a-refresh-in-browser-with-gulp/43463567>

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Setup

```
$ gulp setup
```
Create the project folder structure:

```
root/
|—— dist/
|—— partial-templates/
|—— src/
|   |—— partials/
|   |—— images/
|   |—— template/
```

This will create an empty template file for you, and the associated image folder for that template. 

The template filename doesn't actually matter so rename it if you like; anything will do as long as it's a sensible file name. *DO NOT* change the name of the template image folder. It *must* be called `template`. 

When adding images for a partial, you need to put those images in a folder with the partial name. __The image name doesn't matter but must be unique__: 

```
root/
|—— src/
|   |—— partials/
|   |   |—— partial-name-1.html
|   |—— images/
|   |   |—— partial-name-1/
|   |   |   |—— an-image.png
|   |   |   |—— another-image.jpg
```

Template images obviously go into `images`>`template`. 

```
root/
|—— src/
|   |—— images/
|   |   |—— template/
|   |   |   |—— an-image.png
|   |   |   |—— another-image.jpg
|   |—— template/
|   |   |—— your-template.html
```

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Partials

```
$ gulp partial --n "Partial name" --t id
```

This will copy an existing template into your new partial. By adding `--t id`, where `id` is the letter at the start of the partial-template name (e.g. `--t a` for `a_single-column.html`), you can save yourself the bother of copying the code manually (see below). 

All new partials added by you will be hyphenated where you have spaces, and will also have a unique id number added to the start, e.g. `5-partial-name`. This is to stop you overwriting your existing partials by accident. The id means nothing. 

Partial names that are a single word, e.g. *header*, and the template id don't require speech-marks surrounding them. 

- [Examples of the existing partial-templates](#Current-partial-options)

*EDIT: I've added a single column with background image but this is not yet tested*

__No silly characters in your partial name, please.__ 

(*Why letters instead of numbers, Tony?* Because there are 26 letters in the alphabet and they're all a single character in length. Makes it easier to write the code, and I'm that lazy.) 

```
$ gulp partial --n "Partial name" 
```
This will create an empty partial `html` file in partials and an empty images folder in images with the same name, and insert the necessary `inject` code into the template file. 

Partial names that are a single word, e.g. *header*, and the template id don't require speech-marks surrounding them. 

Then you just need to choose from an existing `partial-template` and copy/paste the code into your new html file, or just write your own partial from scratch. 

All new partials added by you will be hyphenated where you have spaces, and will also have a unique id number added to the start, e.g. `5-partial-name`. This is to stop you overwriting your existing partials by accident. The id means nothing. 

__No silly characters in your partial name, please.__ 

### Example of file structure 

```
root/
|—— src/
|   |—— images/
|   |   |—— your-new-partial/
|   |—— partials/
|   |   |—— your-new-partial.html
```

### Making a partial 

This templating system requires that images in your partial are loaded from `root`>`images`. Remember that partials always use a table format and the content is always encapsulated in a `<tr></tr>`, e.g.:  

```
<tr>
    <td>
        <table>
            <tr>
                <td align="center" valign="top">

                    [content here]

                </td>
            </tr>
        </table>
    </td>
</tr>
```

### Including partials in the template for testing

Partials are injected into the template using the following method:

```
<table>
  <!-- inject:../partials/partial-name-1.html -->
  <!-- endinject -->

  <!-- inject:../partials/partial-name-2.html -->
  <!-- endinject -->
</table>
```

__If you want to change the order of your email content, you can simply change the order of these injects.__ 

This is for the purpose of testing the email (with all partials) in a web browser or, for example, uploading to Litmus for email client testing. 

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Calculate columns

```
$ gulp calCols
```
A quality of life tool if you need to make a new config file at some other max-width. This will log the calculations in the terminal. You need to update the numbers in the function in `gulpfile.js`. 

*That's literally all this is for.*

You're going to ask me why it doesn't just do that for you at compile rather than you setting them all in the config file, aren't you? I know you are... 

I *did* contemplate having the columns calculated on-the-fly, instead of hardcoded into the config file... 

...but I decided that you *might* need to know the width of a column, and looking in the config to find that out is easier than looking at the source of the compiled template. 

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Distribution

```
$ gulp dist
$ gulp dist --s "config550"
```
*All files and folders in `dist` will be erased before this command runs*

This will default to a max-wdith of 650px or you can selectively choose to compile the template at 600px and 550px by inserting the config file you wish to use. 

Convert the partials and template into a single `html` file: 

```
root/
|—— dist/
|   |—— images/
|   |   |—— all.png
|   |   |—— the.png
|   |   |—— imgs.png
|   |—— template-with-embedded-partials.html
```

- Compile the images into `dist`>`images`
- Compile the partials into the template to create a single `html` file which can be viewed in a web browser 
- Place the compiled `html` file in the `dist` folder

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Adding dynamic styles/content

You can add dynamic content to the `config[n].json` files found in the project root. 

```
root/
|—— config500.json
|—— config550.json
|—— config600.json
|—— config650.json
```

These will be used when running `gulp dist` and any matching content will be replaced. Anything you want replaced must be encapsulated in squiggly brackets, thus: `{{aThing}}`. Replacement strings cannot have spaces in them and are *probably* case-insensitive. 

```json
{
  "H1" : "font-size:24px;"
}
```

If you list your template colours last then you can use those colours in your other replacement strings, such as in font declarations within `config[n].json`. 

```json
{
  "C1" : "#000000",
  "C2" : "#005588",
  "C3" : "#777777",
  "C4" : "#FFFFFF"
}
```

So you could declare your fonts lower down the file too, and use those declarations higher up in the file. For instance, here I've defined `F1` and `B` below the headings and paragraph styles, so I can use `F1` to set the font and `B` to make it bold: 

```json
{
  "H1" : "{{F1}}{{B}}font-size:24px;line-height:30px;color:{{BLACK}};",
  "H2" : "{{F1}}{{B}}font-size:20px;line-height:26px;color:{{C2}};",
  "H3" : "{{F1}}{{B}}font-size:16px;line-height:20px;color:{{C2}};",
  "P1" : "{{F1}}font-size:12px;line-height:15px;color:{{C3}};",
  "P2" : "{{F1}}{{I}}font-size:10px;line-height:13px;color:{{C3}};",
  "F1" : "font-family:Arial,sans-serif;mso-line-height-rule:exactly;",
  "LINK" : "text-decoration:none;",
  "B" : "font-weight:bold;",
  "I" : "text-decoration:italic;",
  "U" : "text-decoration:underline;",
  "WHITE" : "#FFFFFF",
  "BLACK" : "#000000",
  "BGNDCOL" : "#f2f2f2",
  "C1" : "#330000",
  "C2" : "#005588",
  "C3" : "#777777",
  "C4" : "#FF33FF"
}
```

You literally don't have to do this if you don't want to. You could explicitly declare the font for each heading style, if that's your preference. 

[Back to menu](#Gulp-Tasks-and-Workflow)

# Current partial options

*EDIT: I've added a single column with background image (m) but this is not yet tested*

a_single-column

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/a_single-column.png)

b_single-column-no-margin

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/b_single-column-no-margin.png)

c_two-columns-1-1

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/c_two-columns-1-1.png)

d_two-columns-1-2

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/d_two-columns-1-2.png)

e_two-columns-1-2-no-margin

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/e_two-columns-1-2-no-margin.png)

f_two-columns-1-3

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/f_two-columns-1-3.png)

g_two-columns-1-3-narrow-margin

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/g_two-columns-1-3-narrow-margin.png)

h_two-columns-2-1

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/h_two-columns-2-1.png)

i_two-columns-3-1

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/i_two-columns-3-1.png)

j_three-columns-1-1-1

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/j_three-columns-1-1-1.png)

k_three-columns-1-2-1

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/k_three-columns-1-2-1.png)

l_four-columns

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/l_four-columns.png)

m_single-column-background

![Partial layout options](https://github.com/Makara-Health/email-templating-system/blob/master/partial-templates/examples/m_single-column-background.png)

[Back to menu](#Gulp-Tasks-and-Workflow)