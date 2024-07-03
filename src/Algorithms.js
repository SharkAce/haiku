/**
 * Finds rhyming words from a dictionary.
 * @param {string} input_word - The word to find rhymes for.
 * @param {number} output_amount - The number of rhyming words to return.
 * @param {Array<string>} dictionary - The dictionary of words to search through.
 * @returns {Array<string>} - A list of rhyming words.
 */
function findRhymes(input_word, output_amount, dictionary) {
  // Create a queue to store matching words
  let matching_words = new Array();

  // Enqueue all words from the dictionary into the matching words queue
  matching_words = [...dictionary];
  // Add a marker to indicate the end of the queue
  matching_words.push("__END_OF_QUEUE__");
  // Iterator to track the position of characters in words
  let character_iterator = 0;
  // Track the size of the matching words queue
  let matching_words_size = dictionary.length;

  // Loop until the desired number of matching words is reached
  while (matching_words_size > output_amount) {
    let current_word = matching_words.shift(); // Dequeue the next word

    // Check if the end of the queue marker is reached
    if (current_word == "__END_OF_QUEUE__") {
      character_iterator++; // Increment the character iterator
      // If all characters of the input word are processed, dequeue extra words
      if (character_iterator >= input_word.length) {
        for (let i = 0; i < matching_words_size - output_amount; i++) {
          matching_words.shift();
        }
        return matching_words;
      }
      // Re-enqueue the end-of-queue marker
      matching_words.push("__END_OF_QUEUE__");
      continue;
    }

    // If the current word is shorter than the character iterator, skip it
    if (character_iterator >= current_word.length) {
      matching_words_size--;
      continue;
    }

    // Calculate the character indices to compare
    let input_index = (input_word.length - 1) - character_iterator;
    let current_index = (current_word.length - 1) - character_iterator;

    // If the characters do not match, decrement the matching words size
    if (input_word[input_index] != current_word[current_index]) {
      matching_words_size--;
      continue;
    }

    // If the characters match, re-enqueue the current word
    matching_words.push(current_word);
  }

  // Reorder the queue to move all words before the end-of-queue marker
  while (matching_words[0] != "__END_OF_QUEUE__") {
    let head = matching_words.shift();
    matching_words.push(head);
  }

  matching_words.shift(); // Remove the end-of-queue marker
  return matching_words; // Return the queue of matching words
}

/**
 * Finds amount of syllables in a text.
 * @param {string} text - The text to count syllables on.
 * @returns {int} - The amount of syllables in the text.
 */
function syllableCount(text) {
  const vowels = "aeiouyAEIOUY".split(''); // Initialize the vowels
  let counter = 0; // Initialize the counter for syllables

  // Initialize flags to track if the current and previous character is a vowel
  let isCurrentVowel = false;
  let isPreviousVowel = false;

  // Iterate through each character in the text
  for (let i = 0; i < text.length; i++) {
    // Check if the current character is a vowel
    for (let j = 0; j < vowels.length; j++) {
      if (text[i] == vowels[j]) {
        isCurrentVowel = true; // Set the current vowel flag to true
        break;
      }
    }

    // Increment the counter if a new vowel group is found
    if (isCurrentVowel && !isPreviousVowel) {
      counter++;
    }

    isPreviousVowel = isCurrentVowel; // Update the previous vowel flag
    isCurrentVowel = false; // Reset the current vowel flag
  }

  return counter; // Return the total count of syllables
}

module.exports = { findRhymes, syllableCount };
