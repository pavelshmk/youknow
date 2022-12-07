export default function ruplu(one: string, few: string, many: string) {
    return function (count: number, withCount: boolean = false, delimiter: string = ' ') {
        const div = parseInt(String(count / 10));
        const mod = count % 10;

        let word = many;

        if (mod === 1 && count !== 11) {
          word = one;
        } else if (mod >= 2 && mod <= 4 && div !== 1) {
          word = few;
        }

        return withCount ? [count, word].join(delimiter) : word;
    }
};

