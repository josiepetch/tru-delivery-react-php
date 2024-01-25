// src/common/password.ts

export const generateRandomPassword = (length: number = 12): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_+=';

    // get length of each type above
    const charsLength = length / 2
    const numbersLength = charsLength / 2
    const symbolsLength = length - (charsLength - numbersLength)

    // shuffle
    const shuffledChars = Array.from(chars).sort(() => Math.random() - 0.5);
    const shuffledNumbers = Array.from(numbers).sort(() => Math.random() - 0.5);
    const shuffledSymbols = Array.from(symbols).sort(() => Math.random() - 0.5);

    // slide to length of type
    const randomCharsPassword = shuffledChars.slice(0, charsLength).join('');
    const randomNumbersPassword = shuffledNumbers.slice(0, numbersLength).join('');
    const randomSymbolsPassword = shuffledSymbols.slice(0, symbolsLength).join('');

    // conbine them together
    const allChars = randomCharsPassword + randomNumbersPassword + randomSymbolsPassword;
    const shuffledallChars = Array.from(allChars).sort(() => Math.random() - 0.5);
    const randomPassword = shuffledallChars.slice(0, length).join('');

    return randomPassword;
};

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
}
