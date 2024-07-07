function findRhymes(input_word, output_amount, word_list) {
  // Create a queue to store matching words
  let matching_words = new Array();
  const vowels = "aeiouyAEIOUY".split(''); // Initialize the vowels

  // Enqueue all words from the word_list into the matching words queue
  matching_words = [...word_list];
  // Add a marker to indicate the end of the queue
  matching_words.push("__END_OF_QUEUE__");
  // Iterator to track the position of characters in words
  let character_iterator = 0;
  // Track the size of the matching words queue
  let matching_words_size = word_list.length;

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

		// If the current word is the same as the input word, discrad it
		if (current_word == input_word) {
      matching_words_size--;
      continue;
		}

    // If the current word is shorter than the character iterator, discard it
    if (character_iterator >= current_word.length) {
      matching_words_size--;
      continue;
    }

    // Calculate the character indices to compare
    let input_index = (input_word.length - 1) - character_iterator;
    let current_index = (current_word.length - 1) - character_iterator;

    // If the characters do not match, discard the current word
    if (input_word[input_index] != current_word[current_index]) {
      matching_words_size--;
      continue;
    }
		
		// If the previous character of the current word is a vowel, we also check it
		// This is to discard syllables that don't match
		if (input_index > 0 && current_index > 0) {
			let next_is_vowel = false;
			for (let i = 0; i < vowels.length; i++) {
				if (current_word[current_index - 1] == vowels[i]) {
					next_is_vowel = true;
					break;
				}
			}
			if (next_is_vowel && input_word[input_index - 1] != current_word[current_index -1 ]) {
      	matching_words_size--;
      	continue;
			}
		}

		// If the word passes all checks, re-enqueue it
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
