import { Essay } from "./models";
import { compareTwoStrings as compare } from "string-similarity";
import dictionaryWords from "./util/wordList";

export default class Grader {
    private static readonly NONOS = ["very", "really", "got", "get", "getting", "gotten"];
    private static readonly PREPOSITIONS = ["with", "at", "by", "to", "in", "for", "from", "of", "on"];
    private readonly rawEssayBody: string;
    private readonly trimmedEssayBody: string;
    private readonly essayWords: string[];
    private readonly firstWordsInSentences: string[];
    private readonly lastWordsInSentences: string[];
    

    constructor(rawEssayBody: string) {
        this.rawEssayBody = rawEssayBody;
        this.trimmedEssayBody = rawEssayBody.toLowerCase().replace("’", "'").replace(/\(|\)/g, "").replace(/(\r\n|\n|\r)/gm, "").replace("?", ".").replace("!", ".");
        this.essayWords = Grader.extractWords(this.trimmedEssayBody);
        [this.firstWordsInSentences, this.lastWordsInSentences] = Grader.extractWordsAroundPeriods(this.trimmedEssayBody);
    }

    private async checkForPlagiarism() {
        let otherEssays = await Essay.find();
        for (let i = 0; i < otherEssays.length; i++) {
            if (compare(otherEssays[i].rawEssayBody || "", this.rawEssayBody) >= 0.8) {
                return otherEssays[i].name;
            }
        }
    }

    private async getProblems() {
        let noNos: number[] = [];
        let spellingErrors: number[] = [];
        let repeatedFirstWords: number[][] = [];
        let prepositions: number[] = [];
        let plagiarism = await this.checkForPlagiarism();
        let problems = {
            hasValidLength: 499 < this.essayWords.length && 1001 > this.essayWords.length,
            noNos: noNos,
            spellingErrors: spellingErrors,
            repeatedFirstWords: repeatedFirstWords,
            terminatingPrepositions: prepositions,
            plagiarism: plagiarism
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

    private static extractWords = (trimmedEssayBody: string) => trimmedEssayBody.match(/\b(\w+)'?(\w+)?\b/g) as string[];
    private static isWord = (word: string) => dictionaryWords.includes(word) || parseInt(word);
    private static extractWordsAroundPeriods(trimmedEssayBody: string) {
        let lastWordsInSentences: string[] = [];
        let firstWordsInSentences: string[] = [];
        let essay = trimmedEssayBody;
        let j = 1;
        // .
        for (let i = essay.indexOf("."); j <= trimmedEssayBody.split(".").length - 1; i = essay.indexOf(".")) {
            let firstSentence = essay.substring(0, essay.indexOf("."));
            let firstWordInSentence = firstSentence.substring(0, firstSentence.indexOf(" ")); // TODO: break with new line
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

    async getGrade() {
        let problems = await this.getProblems();
        let percentGrade = problems.plagiarism ? 0 : Math.max(100 
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
            },
            comment: ""
        };
    }
}