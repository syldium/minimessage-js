/** @type import('@jest/types/build/Config').InitialOptions */
module.exports = {
    roots: ["<rootDir>/test"],
    testMatch: ["<rootDir>/test/**/*.ts"],
    transform: {
        "^.+\\.tsx?$": [
            "esbuild-jest",
            { sourcemap: true, target: 'es2020' }
        ]
    }
};
