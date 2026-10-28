(function () {
  'use strict';

  const app = window.TraumaQuiz;

  const CHARACTER_IDS = ['B', 'Y', 'C', 'P', 'H'];
  const OPTION_IDS = ['A', 'B'];
  const QUESTION_COUNT = 10;
  const OPTION_POINTS = 2;

  function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function checkTextFields(record, fields, path, errors) {
    for (const field of fields) {
      if (!hasText(record[field])) {
        errors.push(`${path}.${field} harus berisi teks.`);
      }
    }
  }

  // Validator tidak mengubah input dan tidak memerlukan DOM atau state sesi.
  function validateData(data) {
    const errors = [];

    if (!isRecord(data)) {
      return { isValid: false, errors: ['Data kuis harus berupa objek.'] };
    }

    const characters = Array.isArray(data.characters) ? data.characters : [];
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const characterIds = new Set();
    const questionIds = new Set();
    const pairs = new Set();
    const sideCounts = {};

    for (const id of CHARACTER_IDS) {
      sideCounts[id] = { A: 0, B: 0 };
    }

    if (characters.length !== CHARACTER_IDS.length) {
      errors.push('Data harus memuat tepat lima karakter.');
    }

    for (const [index, character] of characters.entries()) {
      const path = `characters[${index}]`;
      if (!isRecord(character)) {
        errors.push(`${path} harus berupa objek.`);
        continue;
      }

      if (!CHARACTER_IDS.includes(character.id) || characterIds.has(character.id)) {
        errors.push(`${path}.id tidak dikenal atau duplikat.`);
      }
      characterIds.add(character.id);
      checkTextFields(character, ['name', 'title', 'summary', 'description', 'message'], path, errors);

      if (!Array.isArray(character.strengths) || character.strengths.length !== 3
        || !Array.from(character.strengths).every(hasText)) {
        errors.push(`${path}.strengths harus memuat tiga teks kekuatan.`);
      }

      if (!isRecord(character.theme) || !hasText(character.theme.motif)
        || typeof character.theme.accent !== 'string'
        || !/^#[0-9a-f]{6}$/i.test(character.theme.accent)) {
        errors.push(`${path}.theme harus memuat motif dan warna hex enam digit.`);
      }
    }

    if (questions.length !== QUESTION_COUNT) {
      errors.push('Data harus memuat tepat sepuluh pertanyaan.');
    }

    for (const [index, question] of questions.entries()) {
      const path = `questions[${index}]`;
      if (!isRecord(question)) {
        errors.push(`${path} harus berupa objek.`);
        continue;
      }

      const expectedId = `Q${String(index + 1).padStart(2, '0')}`;
      if (question.id !== expectedId || questionIds.has(question.id)) {
        errors.push(`${path}.id harus unik dan mengikuti urutan Q01–Q10.`);
      }
      questionIds.add(question.id);
      checkTextFields(question, ['context', 'prompt'], path, errors);

      if (!Array.isArray(question.options) || question.options.length !== OPTION_IDS.length) {
        errors.push(`${path}.options harus memuat tepat pilihan A dan B.`);
        continue;
      }

      const mappedIds = [];
      const labels = new Set();
      for (const [sideIndex, option] of question.options.entries()) {
        const optionPath = `${path}.options[${sideIndex}]`;
        if (!isRecord(option)) {
          errors.push(`${optionPath} harus berupa objek.`);
          continue;
        }

        const side = OPTION_IDS[sideIndex];
        if (option.id !== side) {
          errors.push(`${optionPath}.id harus ${side}.`);
        }
        checkTextFields(option, ['label', 'reason'], optionPath, errors);
        if (hasText(option.label)) {
          labels.add(option.label.trim());
        }
        if (option.points !== OPTION_POINTS) {
          errors.push(`${optionPath}.points harus bernilai 2.`);
        }

        if (!CHARACTER_IDS.includes(option.characterId) || !characterIds.has(option.characterId)) {
          errors.push(`${optionPath}.characterId tidak dikenal.`);
        } else {
          mappedIds.push(option.characterId);
          sideCounts[option.characterId][side] += 1;
        }
      }

      if (labels.size !== OPTION_IDS.length) {
        errors.push(`${path} harus mempunyai dua label pilihan yang berbeda.`);
      }
      if (mappedIds.length !== OPTION_IDS.length || mappedIds[0] === mappedIds[1]) {
        errors.push(`${path} harus membandingkan dua karakter berbeda yang valid.`);
      } else {
        const pair = mappedIds.slice().sort().join(':');
        if (pairs.has(pair)) {
          errors.push(`${path} memakai pasangan karakter yang sudah ada.`);
        }
        pairs.add(pair);
      }
    }

    if (pairs.size !== QUESTION_COUNT) {
      errors.push('Kuis harus memuat sepuluh pasangan karakter yang unik.');
    }
    for (const id of CHARACTER_IDS) {
      if (sideCounts[id].A !== 2 || sideCounts[id].B !== 2) {
        errors.push(`Karakter ${id} harus muncul dua kali di A dan dua kali di B.`);
      }
    }

    if (!Array.isArray(data.tieBreakOrder) || data.tieBreakOrder.length !== CHARACTER_IDS.length
      || !CHARACTER_IDS.every((id, index) => data.tieBreakOrder[index] === id)) {
      errors.push('Urutan seri harus B → Y → C → P → H.');
    }

    return { isValid: errors.length === 0, errors };
  }

  function validateAnswers(answers) {
    const errors = [];

    if (!Array.isArray(answers) || answers.length !== QUESTION_COUNT) {
      return { isValid: false, errors: ['Jawaban harus berupa array berisi sepuluh pilihan.'] };
    }

    for (const [index, answer] of answers.entries()) {
      if (!OPTION_IDS.includes(answer)) {
        errors.push(`Jawaban Q${String(index + 1).padStart(2, '0')} harus A atau B.`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  function calculateScores(data, selections) {
    const scores = {};
    for (const character of data.characters) {
      scores[character.id] = 0;
    }
    for (const option of selections) {
      scores[option.characterId] += option.points;
    }
    return scores;
  }

  function selectWinner(data, selections, scores) {
    const highestScore = Math.max(...Object.values(scores));
    const candidates = data.tieBreakOrder.filter((id) => scores[id] === highestScore);

    if (candidates.length === 1) {
      return candidates[0];
    }

    const comparisonScores = {};
    for (const id of candidates) {
      comparisonScores[id] = 0;
    }

    // Kelompok seri awal tetap dipakai; pembanding tidak dihitung ulang secara rekursif.
    for (const [index, question] of data.questions.entries()) {
      if (question.options.every((option) => candidates.includes(option.characterId))) {
        comparisonScores[selections[index].characterId] += 1;
      }
    }

    const highestComparisonScore = Math.max(...Object.values(comparisonScores));
    return data.tieBreakOrder.find((id) => candidates.includes(id)
      && comparisonScores[id] === highestComparisonScore);
  }

  function calculateResult(data, answers) {
    const dataValidation = validateData(data);
    if (!dataValidation.isValid) {
      throw new TypeError(`Data kuis tidak valid: ${dataValidation.errors.join(' ')}`);
    }

    const answerValidation = validateAnswers(answers);
    if (!answerValidation.isValid) {
      throw new TypeError(`Jawaban kuis tidak valid: ${answerValidation.errors.join(' ')}`);
    }

    const selections = data.questions.map((question, index) => question.options.find(
      (option) => option.id === answers[index]
    ));
    const scores = calculateScores(data, selections);
    const characterId = selectWinner(data, selections, scores);
    const reasons = selections
      .filter((option) => option.characterId === characterId)
      .slice(0, 2)
      .map((option) => option.reason);

    return { characterId, scores, reasons };
  }

  app.quiz = { validateData, validateAnswers, calculateResult };
})();
