# Essay Grader

## Prompt
> English teacher Mr. Mark Adams is tired of grading students' English papers, so he's proposed to us a new project. He wants us to put together a website where students can upload their essays and receive a grade by the automatic grader that uses the same algorithmic grading he uses. (To make this clear, there is no such teacher named Mr. Mark Adams, and this is not a real project). 
> Mr. Adams trusts his students, so you do not need to build any sort of authentication.
> Try to accomplish at least two of these mini-parts.

### Tasks
- [x] 1% off for nasty no-nos, including "very," "really," and any tense of get (like "got", "has been getting", etc.)
- [x] 1% off for any spelling mistake (Mr. Adams makes extra sure to choose books with conventional spellings, so assume students won't use proper nouns that aren't in your spelling dictionary)
- [x] 3% off for a pair of sentences starting with the same word, separated by no more than 3 sentences in between, exclusive. No double counting the pair.
- [x] 5% off for any sentence that, lord forbid, ends in a preposition (like "for," "of," etc.)
- [x] The essay must fit within the word count of 500-1000 words. 50% should be taken off if it is not. He gave us a ten minute rant about how "It's literally just one button to click to check the count!," so we better implement this well. 
- [x] BONUS: Detect plagiarism. Any paper that is a copy of a previous one gets a big fat zero as the grade, regardless of what other errors were made. The grade of the original remains the same. Some students are sneaky and may change a word or two, so your detection should be robust.
- [x] The grade starts at 100%, and percentage points are subtracted until the student gets a -200%. At that point Mr. Adams takes mercy and stops subtracting points. Thus -200% is the minimum grade, and you should never give a grade any lower

### Procudure
- [x] Create a function that given the essay as a string, gives a grade using at least two of Mr. Adam's rules (props if you can implement all).
- [x] Use Express/Koa and Node.js to create a webserver that handles POST requests to http://localhost:2020/. The server should reply with a grade (if you don't do part 1 you can return 50% for all essays; that's a healthy compromise between Mr. Adams and his students).
- [x] In addition to replying with a grade, give the user a list of reasons why points got taken off (so, an explanation for each point taken off).
- [x] Make a webpage with a text field for the student's name, their essay, and a submit button. Clicking the submit button should send a POST request somewhere. If you have coded the POST request, have the page show the score to the student.
- [x] Implement an administrative page for Mr. Adams (you can host this at localhost:2020/admin). This should show him the scores each student receives for the essay. Use MongoDB to store the grades. He's only concerned with the grades and doesn't care about the content of the essays.

## Testing Locally
1. `npm i`
2. `npm start`