const letterPoints = {
  A: 1, B: 3, C: 3, D: 2,
  E: 1, F: 4, G: 2, H: 4,
  I: 1, J: 8, K: 5, L: 1,
  M: 3, N: 1, O: 1, P: 3,
  Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8,
  Y: 4, Z: 10
};

let wordList = [];

fetch('words.txt')
  .then(response => response.text())
  .then(data => {
    wordList = data
      .split(/\r?\n/)
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length > 0);
  });

function canMakeWord(letters, word) {
  const letterCounts = {};

  for (let char of letters) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  for (let char of word) {
    if (!letterCounts[char]) {
      return false;
    }
    letterCounts[char]--;
  }

  return true;
}

function getWordPoints(word) {
  return word.split('').reduce((score, letter) => {
    return score + (letterPoints[letter] || 0);
  }, 0);
}

function findWords() {
  const input = document.getElementById('letterInput').value.toUpperCase().replace(/[^A-Z]/g, '');
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!input || input.length === 0) {
    resultsDiv.innerHTML = '<p>Please enter some letters.</p>';
    return;
  }

  const matches = [];

  for (let word of wordList) {
    if (word.length >= 4 && canMakeWord(input, word)) {
      matches.push({
        word: word,
        points: getWordPoints(word),
        length: word.length
      });
    }
  }

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<p>No matching words found.</p>';
    return;
  }

  matches.sort((a, b) => b.length - a.length || b.points - a.points);

  const list = document.createElement('ul');
  for (let match of matches) {
    const item = document.createElement('li');
    item.textContent = `${match.word} - ${match.points} pts`;
    list.appendChild(item);
  }

  resultsDiv.appendChild(list);

  const note = document.createElement('p');
  note.textContent = 'Point totals shown do not account for modifiers';
  resultsDiv.appendChild(note);
}
