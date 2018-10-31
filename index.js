const _ = require("lodash");

module.exports = function({
  variants = [],
  patterns = [],
  colors = {
    default: "9C92AC"
  },
  opacity = {
    default: 0.4
  }
}) {
  return function({ e, addUtilities }) {
    const heros = require("./patterns");
    if (patterns.length === 0) patterns = Object.keys(heros);

    const newUtilities = _.map(opacity, (alpha, opacityName) => {
      return _.map(colors, (color, colorName) => {
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
