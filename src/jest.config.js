export const testEnvironment = 'node';
export const moduleFileExtensions = ['js', 'jsx', 'cjs'];
export const transform = {
    '^.+\\.[jt]sx?$': 'babel-jest'
};
export const testMatch = ['**/?(*.)+(test).[jt]s?(x)', '**/?(*.)+(spec).[jt]s?(x)'];
