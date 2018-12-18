const colors = require("./source.json");
const fs = require("fs");
const colorsFile = "./lib/colors.json";
const specScssFile = "./lib/color-cn.scss";

function rgb2hsv(rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, v];
}

function sort(ary) {
  return ary.sort(function(a, b) {
    if (rgb2hsv(a.RGB)[0] === rgb2hsv(b.RGB)[0]) {
      return rgb2hsv(b.RGB)[1] - rgb2hsv(a.RGB)[1];
    } else {
      return rgb2hsv(b.RGB)[0] - rgb2hsv(a.RGB)[0];
    }
  });
}

function main() {
  const array = sort(colors);
  const tab = "  ";
  let colorScss = "";
  let clsScss = "";
  const colorsData = [];
  for (const color of array) {
    const cnName = color["name"];
    const enName = color["pinyin"];
    const hexCode = color["hex"];
    const colorDef = `$${enName}: ${hexCode};\n`;
    const clsDef = `.${enName} {\n${tab}color: $${enName};\n}\n.bg-${enName} {\n${tab}background-color: $${enName};\n}\n`;
    colorScss += colorDef;
    clsScss += clsDef;
    colorsData.push({
      cnName,
      enName,
      hexCode,
    })
  }
  const specScssContent = colorScss + "\n\n// =================\n\n" + clsScss;
  fs.writeFileSync(specScssFile, specScssContent);
  fs.writeFileSync(colorsFile, JSON.stringify(colorsData));
  console.log(`build ${specScssFile} success!`);
}

main();
