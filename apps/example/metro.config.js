const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

const config = {
    watchFolders: [
        path.resolve(projectRoot, 'packages'),
        path.resolve(projectRoot, 'node_modules'),

    ],
    resolver: {
        // Tell Metro to look in multiple node_modules locations
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(projectRoot, 'node_modules'),
        ],
        extraNodeModules: {
            'react-native': path.resolve(__dirname, 'node_modules/react-native'),
        },
        // Asegurar que Metro pueda resolver el módulo rn-sherpa
        alias: {
            'rn-sherpa': path.resolve(projectRoot, 'packages/core/src'),
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
