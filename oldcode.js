var inputpath = "../input/";
var outputpath = "../output/spritesheet";
var max_size = { w: 4096, h: 4096 };
var margin = 0; //default of 0 leaves 1px 

/* --  Including some required stuff -- */
var fs = require("fs");
var sizeOf = require("image-size");
var path = require("path");
var images = require("images");


/* --  Start processing -- */
var inputfiles = fs.readdirSync("../input");
var filenames = [];
var sprites = [];
inputfiles.forEach(function (item) {
    if (path.extname(item) === ".png") {
        filenames.push(item);
        var spritesize = sizeOf(inputpath + item);
        spritesize["filename"] = inputpath + item;
        spritesize["w"] = spritesize.width * 1;
        spritesize["h"] = spritesize.height * 1;
        sprites.push(spritesize);
    }
});
sprites.sort(sortSizes);

/* -- Now we plot the layout --*/
var row_width = margin;
var row_idx = 0;
var tot_height = 0;
var rows = []
sprites.forEach(
    function (sprite) {
        if (typeof rows[row_idx] === "undefined") {
            rows.push([]);
            row_width = margin;
        }
        if (!widthFits(row_width, sprite.w)) {
            row_idx += 1;
            rows.push([]);
            row_width = margin;
        }
        rows[row_idx].push(sprite);
        row_width += sprite.w + 1 + margin;
    }
);
var emptycheck = rows.pop();
if (emptycheck.length > 0) {
    rows.push(emptycheck);
}


/* -- And what size is our image to be? -- */
var img_height = 1;
var img_width = 1;
rows.forEach(
    function (row) {
        if (row[0].h + img_height + 1 + margin > max_size.h) {
            console.log("Skipping a row, maximum image size too small.");
        }
        else {
            img_height += row[0].h + 1 + margin;
            var row_width = 1;
            row.forEach(
                function (sprite) {
                    row_width += sprite.w + 1 + margin;
                    if (row_width > img_width) {
                        img_width = row_width;
                    }
                }
            );
        }
    }
);
console.log("Image height: " + img_height);
console.log("Image width: " + img_width);

var newimg = images(img_width, img_height);

var start_y = 1 + margin;

/* -- Now we've worked out the rows, let's assemble it -- */
var maps = {};
rows.forEach(
    function (row) {
        var start_x = 1 + margin;
        row.forEach(
            function (sprite) {
                var spriteimage = images(sprite.filename);
                newimg.draw(spriteimage, start_x, start_y);
                //here we can map it
                var filepath = path.parse(sprite.filename);
                maps[filepath.base.replace(filepath.ext, "")] = {
                    frame: {
                        x: start_x,
                        y: start_y,
                        w: sprite.w,
                        h: sprite.h
                    },
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: {
                        x: 0,
                        y: 0,
                        w: sprite.w,
                        h: sprite.h
                    },
                    sourceSize: {
                        w: sprite.w,
                        h: sprite.h
                    }
                };
                start_x += sprite.w + 1 + margin;
            }
        );
        start_y += row[0].h + 1 + margin;
    }
);

/* -- Save it, we're done! -- */
newimg.save(outputpath + ".png");

/* -- Do some map formatting, then output it -- */
var mapfile = {
    frames: maps,
    meta: {
        image: path.parse(outputpath + ".png").base,
        format: "RGBA8888",
        size: {
            w: img_width,
            h: img_height
        },
        scale: 1
    }
};
fs.writeFile(outputpath + ".json", JSON.stringify(mapfile), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

function widthFits(a, b) {
    if (a + 1 + margin + b <= max_size.w) {
        return true;
    }
    return false;
}

function sortSizes(a, b) {
    if (a.h < b.h)
        return 1;
    if (a.h > b.h)
        return -1;
    return 0;
}