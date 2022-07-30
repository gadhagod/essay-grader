import dictionaryWords from "./util/wordList";

export default class Grader {
    private static readonly NONOS = ["very", "really", "got", "get", "getting", "gotten"];
    private static readonly PREPOSITIONS = ["with", "at", "by", "to", "in", "for", "from", "of", "on"];
    private readonly essayBody: string;
    private readonly essayWords: string[];
    private readonly firstWordsInSentences: string[];
    private readonly lastWordsInSentences: string[];
    

    constructor(essayBody: string) {
        this.essayBody = essayBody.toLowerCase().replace(/\(|\)/g, "").replace(/(\r\n|\n|\r)/gm, "").replace("?", ".").replace("!", "");
        this.essayWords = Grader.extractWords(this.essayBody);
        [this.firstWordsInSentences, this.lastWordsInSentences] = Grader.extractWordsAroundPeriods(this.essayBody);
    }

    private getProblems() {
        let noNos: number[] = [];
        let spellingErrors: number[] = [];
        let repeatedFirstWords: number[][] = [];
        let prepositions: number[] = [];
        let problems = {
            hasValidLength: 499 < this.essayWords.length && 1001 > this.essayWords.length,
            noNos: noNos,
            spellingErrors: spellingErrors,
            repeatedFirstWords: repeatedFirstWords,
            terminatingPrepositions: prepositions
        }

        for (let i = 0; i < this.essayWords.length; i++) {
            let word = this.essayWords[i];
            // check nasty no-nos
            if (Grader.NONOS.includes(word)) {
                problems.noNos.push(i);
            }

            // check if spelled right
            if(!Grader.isWord(word) && !(word.includes("'") && Grader.isWord(word.substring(0, word.indexOf("'"))))) {
                problems.spellingErrors.push(i);
            }
        }

        // check repeated first words and prepositions in last words
        if (this.firstWordsInSentences.length >= 2) {
            for (let i = 0; i < this.firstWordsInSentences.length; i++) {
                if (i < this.firstWordsInSentences.length - 3) {
                    let nextFirstWords = this.firstWordsInSentences.slice(i + 1 , i + 5);
                    if (nextFirstWords.includes(this.firstWordsInSentences[i])) {
                        problems.repeatedFirstWords.push([
                            i,
                            i + 1 + nextFirstWords.indexOf(this.firstWordsInSentences[i])
                        ]);
                    }
                }
                if (Grader.PREPOSITIONS.includes(this.lastWordsInSentences[i])) {
                    problems.terminatingPrepositions.push(i);
                }
            }
        }

        return problems;
    }

    private static extractWords = (essayBody: string) => essayBody.match(/\b(\w+)'?(\w+)?\b/g) as string[];
    private static isWord = (word: string) => dictionaryWords.includes(word);
    private static extractWordsAroundPeriods(essayBody: string) {
        let lastWordsInSentences: string[] = [];
        let firstWordsInSentences: string[] = [];
        let essay = essayBody;
        let j = 1;
        // .
        for (let i = essay.indexOf("."); j <= essayBody.split(".").length - 1; i = essay.indexOf(".")) {
            let firstSentence = essay.substring(0, essay.indexOf("."));
            let firstWordInSentence = firstSentence.substring(0, firstSentence.indexOf(" "));
            let lastWordInFirstSentence = firstSentence.substring(firstSentence.lastIndexOf(" ")+1);
            firstWordsInSentences.push(firstWordInSentence);
            lastWordsInSentences.push(lastWordInFirstSentence);

            if(essay.indexOf(".") === 0) {
                break;
            }
            essay = essay.substring(essay.indexOf(".")+2);
            j++;
        }
        return [
            firstWordsInSentences,
            lastWordsInSentences
        ];
    }

    getGrade() {
        let problems = this.getProblems();
        let percentGrade = Math.max(100 
            - problems.noNos.length 
            - problems.spellingErrors.length 
            - 3 * problems.repeatedFirstWords.length 
            - 5 * problems.terminatingPrepositions.length
            - (problems.hasValidLength ? 0 : 50), -200);
        let letterGrade = ((percentGrade: number) => {
            if (percentGrade >= 96.5) return "A+";
            else if (percentGrade >= 92.5) return "A";
            else if (percentGrade >= 89.5) return "A-";
            else if (percentGrade >= 86.5) return "B+";
            else if (percentGrade >= 82.5) return "B";
            else if (percentGrade >= 79.5) return "B-";
            else if (percentGrade >= 76.5) return "C+";
            else if (percentGrade >= 72.5) return "C";
            else if (percentGrade >= 69.5) return "C-";
            else if (percentGrade >= 66.5) return "D+";
            else if (percentGrade >= 62.5) return "D";
            else if (percentGrade >= 59.5) return "D-";
            return "F";
        })(percentGrade);

        return {
            percentGrade: percentGrade,
            letterGrade: letterGrade,
            problems: problems,
            data: {
                essayWords: this.essayWords,
                firstWordsInSentences: this.firstWordsInSentences,
                lastWordsInSentences: this.lastWordsInSentences
            }
        };
    }
}
/*
let essay = new Grader(`
Get I'm house Today is the anniversary potn of the publication of car's iconic poem “Stopping by Woods on a Snowy Evening,” a fact that spurred the Literary Hub office into a long conversation about their favorite poems, the most iconic poems written in English, and which poems we should all have already read (or at least be reading next). 
I'm Turns out, despite frequent (false) claims that poetry is dead and/or irrelevant and/or boring, there are plenty of poems that have sunk deep into our collective consciousness as cultural icons. i'm (What makes a poem iconic? For our purposes here, it's primarily a matter of cultural ubiquity, though unimpeachable excellence helps any case.) So for those of you who were not present for our epic office argument, I have listed some of them here. returns the number with the lowest value. My mommy told me. Hai guys. I am writing an essay resultr. What are you doing. Hai poop. My mommy of.`);
console.log(essay.getGrade());
*/