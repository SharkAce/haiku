# Haiku - ADS 1 Mid-term CW

## Preface
This project was a homework in which we had to design at least one algorythm to aid in the creation of poems and implement it in javascript. It uses the [commander](https://www.npmjs.com/package/commander) library to create a functional and documented cli with minimal additional code. For readability purposes I slighly modified the structure of this file compared to my submission.

## Installation
```
$ git clone https://github.com/sharkace/todo-cli.git
$ cd todo-cli
$ npm i
// To create a link in /usr/bin:
# npm i -g
```

## Usage

- ### `haiku rhyme` (Implementation of Find Rhymes)
```
Usage: haiku rhyme [options] <WORD...>

Search for words that rhyme with the given input words

Arguments:
  WORD                    Words to find ryhmes for

Options:
  -n, --num <NUM>         Specify the desired number of matches (default: 5)
  -w, --word-list <FILE>  Specify the dictionary file path (default:
                          "/home/charles/github/haiku/wordlist.txt")
  -s, --no-shuffle        Do not randomize the dictionary
  -h, --help              display help for command
```

- ### `haiku count` (Implementation of Count Syllables)
```
Usage: haiku count [options] <TEXT...>

Counts the number of syllables in a text

Arguments:
  TEXT        The texts to count syllables on

Options:
  -h, --help  display help for command
```

## Algorithms Explanation
- ### **Find Rhymes**:
My implementation of the **Find Rhymes** algorithm is a modified version of the [queue search algorithm](https://www.coursera.org/learn/uol-algorithms-and-data-structures-1/lecture/ctKfB/4-2-5-searching-stacks-and-queues). It takes three inputs: the word to match, the desired number of matches, and a word list of possible matches.

First, we add all the words from the word list to a list of possible matches and a marker to identify the end of this list.

Next, we compare the last character of the input word with the last character of the first word in the possible match list. If they match, we add that word back to the end of the list; otherwise, we discard it.

In addition, if the previous character of the current word is a vowel, we also check it to ensure at a basic level that the sound matches. This involves checking if the character to the left of the current one is a vowel and, if so, verifying that it matches the corresponding character in the input word. If it does not match, the word is discarded.

We repeat this process until we find our marker. When that happens, it means we have checked all the words for a match at the specific character position. We then start comparing the character to the left of the previous one we checked. We also handle any edge cases to prevent memory access violations.

We continue this process until we have discarded enough non-matching words to leave us with the desired number of matches. Finally, we find and remove the marker and return the list of matches.

- ### **Syllable Count**:
My implementation of the **Syllable Count** algorithm is a simple but incomplete way of finding syllables in a piece of text.

To start, we take the first character of the text and check if it is a vowel. If so, we increment the counter of syllables.

We continue checking the subsequent characters, and every time we encounter a vowel, we increment the counter only if the last character was not a vowel. This is implemented to count groups of vowels as single syllables (i.e., “ou”, “ei”, etc.).

Once every character has been iterated through, we return the counter’s current count.

## Pseudocode

\* Words and texts are represented as Vectors of characters. Additionally, `word_list` is a Vector containing words, making it a Vector of Vectors of characters.

\*\* Every Vector, whether explicitly defined or implied (as in the case of words), is zero-indexed, meaning the first index is zero.

- ### **Find Rhymes**:
<pre style="font-family: Babas; font-size: 1em">
<b>function</b> Find_Rhymes(<i>input_word</i>, <i>output_amount</i>, <i>word_list</i>)
	// Create a queue to store matching words
	<b>new</b> Queue <i>matching_words</i>
	<b>new</b> Vector(12) <i>vowels</i>  // Create a vector to store vowels
	<i>vowels</i> ← "aeiouyAEIOUY"  // Initialize the vowels

	// Enqueue all words from the word_list into the matching words queue
	<b>for</b> 0 ≤ <i>i</i> < LENGTH[<i>word_list</i>] <b>do</b>
		ENQUEUE[<i>word_list</i>[<i>i</i>], <i>matching_words</i>]
	<b>end for</b>

	// Add a marker to indicate the end of the queue
	ENQUEUE["__END_OF_QUEUE__", <i>matching_words</i>]

	<i>character_iterator</i> ← 0  // Iterator to track the position of characters in words
	<i>matching_words_size</i> ← LENGTH[<i>word_list</i>]  // Track the size of the matching words queue

	// Loop until the desired number of matching words is reached
	<b>while</b> <i>matching_words_size</i> > <i>output_amount</i> <b>do</b>
		<i>current_word</i> ← DEQUEUE[<i>matching_words</i>]  // Dequeue the next word

		// Check if the end of the queue marker is reached
		<b>if</b> <i>current_word</i> = "__END_OF_QUEUE__" <b>then</b>
			<i>character_iterator</i> ← <i>character_iterator</i> + 1 // Increment the character iterator
			// If all characters of the input word are processed, dequeue extra words
			<b>if</b> <i>character_iterator</i> ≥ LENGTH[<i>input_word</i>] <b>then</b>
				<b>for</b> 0 ≤ <i>i</i> < <i>matching_words_size</i> - <i>output_amount</i> <b>do</b>
					DEQUEUE[<i>matching_words</i>]
				<b>end for</b>
				<b>return</b> <i>matching_words</i>
			<b>end if</b>
			// Re-enqueue the end-of-queue marker
			ENQUEUE["__END_OF_QUEUE__", <i>matching_words</i>]
			<b>continue</b>
		<b>end if</b>

        // If the current word is the same as the input word, discrad it
        <b>if</b> <i>current_word</i> = <i>input_word</i> <b>then</b>
			<i>matching_words_size</i> ← <i>matching_words_size</i> - 1
			<b>continue</b>
		<b>end if</b>

		// If the current word is shorter than the character iterator, discard it
		<b>if</b> <i>character_iterator</i> ≥ LENGTH[<i>current_word</i>] <b>then</b>
			<i>matching_words_size</i> ← <i>matching_words_size</i> - 1
			<b>continue</b>
		<b>end if</b>

        // Calculate the character indices to compare
		<i>input_index</i> ← (LENGTH[<i>input_word</i>] - 1) - <i>character_iterator</i>
		<i>current_index</i> ← (LENGTH[<i>current_word</i>] - 1) - <i>character_iterator</i>

		// If the characters do not match, discard the current word
		<b>if</b> <i>input_word</i>[<i>input_index</i>] ≠ <i>current_word</i>[<i>current_index</i>] <b>then</b>
			<i>matching_words_size</i> ← <i>matching_words_size</i> - 1
			<b>continue</b>
		<b>end if</b>

        // If the previous character of the current word is a vowel we also check it
        <b>if</b> <i>input_index</i> > 0 ∧ <i>current_index</i> > 0 <b>then</b>
            <i>next_is_vowel</i> ← FALSE
            <b>for</b> 0 ≤ <i>i</i> < LENGTH[<i>vowels</i>] <b>do</b>
                <b>if</b> <i>current_word</i>[<i>current_index</i> - 1] = <i>vowels</i>[<i>i</i>] <b>then</b>
                    <i>next_is_vowel</i> ← TRUE
                    <b>break</b>
                <b>end if</b>
            <b>end for</b>
		    <b>if</b> <i>next_is_vowel</i> ∧ <i>input_word</i>[<i>input_index</i> - 1] ≠ <i>current_word</i>[<i>current_index</i> - 1] <b>then</b>
		        <i>matching_words_size</i> ← <i>matching_words_size</i> - 1
			    <b>continue</b>
		    <b>end if</b>
        <b>end if</b>

        // If the word passes all checks, re-enqueue it
		ENQUEUE[<i>current_word</i>, <i>matching_words</i>]
	<b>end while</b>

	// Reorder the queue to move all words before the end-of-queue marker
	<b>while</b> HEAD[<i>matching_words</i>] ≠ "__END_OF_QUEUE__" <b>do</b>
		<i>head</i> ← DEQUEUE[<i>matching_words</i>]
		ENQUEUE[<i>head</i>, <i>matching_words</i>]
	<b>end while</b>
	DEQUEUE[<i>matching_words</i>]  // Remove "__END_OF_QUEUE__"

	<b>return</b> <i>matching_words</i>  // Return the queue of matching words
<b>end function</b>
</pre>

- ### **Syllable Count**:

<pre style="font-family: Babas; font-size: 1em">
<b>function</b> Syllable_Count(<i>text</i>)
	<b>new</b> Vector(12) <i>vowels</i>  // Create a vector to store vowels
	<i>vowels</i> ← "aeiouyAEIOUY"  // Initialize the vowels
	<i>counter</i> ← 0  // Initialize the counter for syllables

    // Initialize flags to track if the current and previous character is a vowel
	<i>is_current_vowel</i> ← FALSE
	<i>is_previous_vowel</i> ← FALSE
	
	// Loop through each character in the text
	<b>for</b> 0 ≤ <i>i</i> < LENGTH[<i>text</i>] <b>do</b>
		// Check if the current character is a vowel
		<b>for</b> 0 ≤ <i>j</i> < LENGTH[<i>vowels</i>] <b>do</b>
			<b>if</b> <i>text</i>[<i>i</i>] = <i>vowels</i>[<i>j</i>] <b>then</b>
				<i>is_current_vowel</i> ← TRUE  // Set the current vowel flag to true
				<b>break</b>
			<b>end if</b>
		<b>end for</b>
		
		// Increment the counter if a new vowel group is found
		<b>if</b> <i>is_current_vowel</i> ∧ ¬<i>is_previous_vowel</i> <b>then</b>
			<i>counter</i> ← <i>counter</i> + 1
		<b>end if</b>
		
		<i>is_previous_vowel</i> ← <i>is_current_vowel</i>  // Update the previous vowel flag
		<i>is_current_vowel</i> ← FALSE  // Reset the current vowel flag
	<b>end for</b>
	
	<b>return</b> <i>counter</i>  // Return the total count of syllables
<b>end function</b>
</pre>

## Data Structures

- ### (Queue) `matching_words` : **Find Rhymes**
The Queue data structure was chosen for this role mainly for its FIFO (First In, First Out) properties and dynamic size.

FIFO is useful in this scenario because we want to ensure each word is processed in the order it was added, and each word is only searched once. This prevents unnecessary reprocessing of words and helps maintain an organized workflow inside a single structure. The dynamic size of the queue allows it to adjust as words are added and removed, ensuring that the algorithm can handle varying input sizes. 

Compared to a Stack, a Queue is more suitable because it allows us to store the current and next iteration of checks simultaneously. In a Stack, we would only be able to access the most recent added elements, which would complicate the process of managing and reprocessing the list of words. The Queue's efficient handling of multiple iterations and its dynamic nature make it the preferred choice for this application.

- ### (Vector) `vowels` : **Find Rhymes**, **Count Syllables**
A Vector structure was chosen to store the vowels for two reasons: its simple iterability and static size.

We need simple iterability because the vowels are a constant set where every element needs to be accessed without moving or deleting any of them. This is important because this structure will be used to verify if characters are vowels in both algorithms numerous times using the [linear search algorithm](https://www.coursera.org/learn/uol-algorithms-and-data-structures-1/lecture/ihhPi/4-2-1-linear-search-algorithm).

Also, since we already know the permanent size in advance, we don't need the overhead of being able to dynamically change its size.

## Demonstration
Demo video link: [https://www.youtube.com/watch?v=iMWMgXjcQ2g](https://www.youtube.com/watch?v=iMWMgXjcQ2g)

## Known defects

### Find Rhymes

**Defect 1: Character Matching Instead of Sound Matching**
- **Description:** The current implementation of the **Find Rhymes** algorithm only matches characters at the end of words to determine if they rhyme. A primitive syllable grouping logic is in place to account for most of the issues. However, this approach does not account for the phonetic sounds of words, which can result in inaccurate rhyme suggestions. It will also ignore good possible matches that end with the same sound but not the same characters.
- **Remedy:** To improve the accuracy of the rhyming algorithm, a phonetic approach can be used. One option would be to utilize a known phonetic algorithm such as [Metaphone](https://en.wikipedia.org/wiki/Metaphone), which is designed to index words by their pronunciation. This is a lossy process, so we would store a mapping of the original words to their phonetic representations. This way, after finding matches based on pronunciation, we can retrieve and return the original words.

**Defect 2: Time and Space Complexity Scales with the Size of the Word List**
- **Description:** The current **Find Rhymes** algorithm processes each word in the list, resulting in time and space complexity that scales linearly with the size of the word list. This can become inefficient for large word lists, leading to slow performance and high memory usage.
- **Remedy:** A simple fix to this issue would be to only find the specified amount of output instead of working by elimination. This would reduce the precision of the algorithm but would also give a more diverse set of outputs if the word list was shuffled.

### Syllable Count

**Defect: Only Basic Cases are Handled**
- **Description:** The current **Syllable Count** algorithm handles only basic cases by counting vowels and grouping them. However, it does not account for various exceptions and complex syllable patterns found in the English language, such as silent vowels, diphthongs, and special cases like a slient "e" at the end of some words.
- **Remedy:** To handle more precise syllable counting, we could first split the text by words, using spaces as delimiters while ignoring punctuation marks. After this, we could utilize a syllable dictionary to find the known number of syllables in every word of the text that is included in it. Additionally, we can still use the original algorithm on words that are not part of the dictionary. In the end, we would return the sum of the syllables for every word in the text.

