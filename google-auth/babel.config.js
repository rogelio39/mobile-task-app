module.exports = {
    presets: [
        'babel-preset-expo',
    ],
    plugins: [
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',
                path: '.env',
                blacklist: null,
                whitelist: null,
                safe: false,
                allowUndefined: true,
            },
        ],
        [
            '@babel/plugin-transform-private-methods',
            {
                loose: true,  // Asegúrate de que esté en 'loose' mode
            },
        ],
        [
            '@babel/plugin-transform-class-properties',
            {
                loose: true,  // Asegúrate de que esté en 'loose' mode
            },
        ],
        [
            '@babel/plugin-transform-private-property-in-object',
            {
                loose: true,  // Asegúrate de que esté en 'loose' mode
            },
        ],
    ],
};
