const _ = require("lodash");
const heros = require("./patterns");

const defaultColors = {
  default: "#9C92AC"
};
const defaultOpacity = {
  default: 0.4
};

function flattenThemeColors(colors) {
  const flatColors = {};
  _.each(colors, (color, colorName) => {
    if (typeof color === "object") {
      _.each(color, (value, modifier) => {
        flatColors[`${colorName}-${modifier}`] = value;
      });
    } else {
      flatColors[colorName] = color;
    }
  })
  return flatColors;
}

module.exports = function({
  variants = [],
  patterns = [],
  colors = defaultColors,
  opacity = defaultOpacity,
  includeThemeColors = false,
}) {
  return function({ e, addUtilities, theme }) {
    if (patterns.length === 0) patterns = Object.keys(heros);
    if (Object.keys(colors).length === 0) colors = defaultColors;
    if (Object.keys(opacity).length === 0) opacity = defaultOpacity;

    if (includeThemeColors) {
      colors = {...colors, ...flattenThemeColors(theme("colors")) };
    }

    const newUtilities = _.map(opacity, (alpha, opacityName) => {
      return _.map(colors, (color, colorName) => {
        color = color.replace("#", "%23");
        return patterns.reduce((o, patternName) => {
          let className = `bg-hero-${patternName}`;
          if (colorName != "default") className += `-${colorName}`;
          if (opacityName != "default") className += `-${opacityName}`;
          className = `.${e(className)}`;

          if (!heros[patternName]) return Object.assign(o, {});
          return Object.assign(o, {
            [className]: {
              backgroundImage: heros[patternName]
                .replace("FILLCOLOR", color)
                .replace("FILLOPACITY", alpha)
            }
          });
        }, {});
      });
    });

    addUtilities(newUtilities, variants);
  };
};
