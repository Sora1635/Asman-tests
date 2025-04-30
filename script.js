// Глобальные переменные
let currentLang = localStorage.getItem('lang') || 'ky';
let currentSubject = localStorage.getItem('subject');
let currentPart = localStorage.getItem('part');
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = null;
let timerInterval = null;
let timeLeft = 0;

// Структура вопросов с временем в минутах для каждой части
const questions = {
    math: {
        part1: {
            time: 30, // Время в минутах
            variant1: [
                { question: "Математика 1-бөлүк, суроо 1: 2 + 0 канча болот?", options: { a: "1", b: "2", c: "3", d: "4" }, correct: "b" },
                { question: "Математика 1-бөлүк, суроо 2: 3 + 1 канча болот?", options: { a: "3", b: "4", c: "5", d: "6" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
            variant2: [
                { question: "Математика 1-бөлүк, суроо 1: 3 + 0 канча болот?", options: { a: "2", b: "3", c: "4", d: "5" }, correct: "b" },
                { question: "Математика 1-бөлүк, суроо 2: 4 + 1 канча болот?", options: { a: "4", b: "5", c: "6", d: "7" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
        },
        part2: {
            time: 60,
            variant1: [
                { question: "Математика 2-бөлүк, суроо 1: 1^2 канча болот?", options: { a: "0", b: "1", c: "2", d: "3" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
            variant2: [
                { question: "Математика 2-бөлүк, суроо 1: 1^3 канча болот?", options: { a: "0", b: "1", c: "2", d: "3" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
        },
    },
    kyrgyz: {
        part1: {
            time: 30,
            variant1: [
                { question: "Кыргыз тили 1-бөлүк, суроо 1: 'күн' сөзү эмнени билдирет?", options: { a: "Ай", b: "Жылдыз", c: "Күн", d: "Суу" }, correct: "c" },
                // Добавляйте вопросы сюда
            ],
            variant2: [
                { question: "Кыргыз тили 1-бөлүк, суроо 1: 'ай' сөзү эмнени билдирет?", options: { a: "Ай", b: "Жылдыз", c: "Күн", d: "Суу" }, correct: "a" },
                // Добавляйте вопросы сюда
            ],
        },
        part2: {
            time: 60,
            variant1: [
                { question: "Кыргыз тили 2-бөлүк, суроо 1: 'тоо' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Тоо", c: "Токой", d: "Жол" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
            variant2: [
                { question: "Кыргыз тили 2-бөлүк, суроо 1: 'көл' сөзү эмнени билдирет?", options: { a: "Дарыя", b: "Көл", c: "Токой", d: "Жол" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
        },
    },
    manas: {
        part1: {
            time: 30,
            variant1: [
                { question: "Манас таануу 1-бөлүк, суроо 1: Манас ким?", options: { a: "Алтай", b: "Манас", c: "Каныкей", d: "Семетей" }, correct: "b" },
                // Добавляйте вопросы сюда
            ],
            variant2: [
                { question: "Манас таануу 1-бөлүк, суроо 1: Каныкей ким?", options: { a: "Манастын аялы", b: "Манастын уулу", c: "Манастын душманы", d: "Манастын атасы" }, correct: "a" },
                // Добавляйте вопросы сюда
            ],
        },
        part2: {
            time: 60,
            variant1: [
                { question: "Манас таануу 2-бөлүк, суроо 1: Семетей ким?", options: { a: "Манастын уулу", b: "Манастын аялы", c: "Манастын душманы", d: "Манастын атасы" }, correct: "a" },
                // Добавляйте вопросы сюда
            ],
            variant2: [
                { question: "Манас таануу 2-бөлүк, суроо 1: Айчүрөк ким?", options: { a: "Семетейдин аялы", b: "Манастын аялы", c: "Манастын энеси", d: "Манастын душманы" }, correct: "a" },
                // Добавляйте вопросы сюда
            ],
        },
    },
};

// Переключение языка
function switchLanguage(lang) {
    console.log('Switching language to:', lang);
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

// Обновление текстов на странице
function updateTexts() {
    console.log('Updating texts for language:', currentLang);
    document.querySelectorAll('[data-lang-ky][data-lang-ru]').forEach(el => {
        const text = currentLang === 'ky' ? el.getAttribute('data-lang-ky') : el.getAttribute('data-lang-ru');
        if (el.tagName === 'BUTTON' && el.querySelector('i')) {
            const icon = el.querySelector('i');
            el.innerHTML = '';
            el.appendChild(icon);
            el.appendChild(document.createTextNode(' ' + text));
        } else {
            el.textContent = text;
        }
    });

    // Обновление заголовка предмета
    const subjectTitle = document.getElementById('subject-title');
    if (subjectTitle && currentSubject) {
        const subjectName = currentSubject === 'math' ? (currentLang === 'ky' ? 'Математика' : 'Математика') :
                           currentSubject === 'kyrgyz' ? (currentLang === 'ky' ? 'Кыргыз тили' : 'Кыргызский язык') :
                           currentSubject === 'manas' ? (currentLang === 'ky' ? 'Манас таануу' : 'Манасоведение') : '';
        subjectTitle.textContent = (currentLang === 'ky' ? 'Предмет: ' : 'Предмет: ') + subjectName;
    }

    // Обновление результатов
    const resultsTitle = document.getElementById('results-title');
    const resultsDetails = document.getElementById('results-details');
    if (resultsTitle && resultsDetails) {
        const score = localStorage.getItem('score');
        const totalQuestions = localStorage.getItem('totalQuestions');
        const percentage = localStorage.getItem('percentage');
        const knowledge = localStorage.getItem('knowledge');
        if (score && totalQuestions && percentage && knowledge) {
            resultsTitle.textContent = currentLang === 'ky' ? 'Тесттин жыйынтыктары' : 'Результаты теста';
            resultsDetails.innerHTML = `${currentLang === 'ky' ? 'Балл' : 'Баллы'}: ${score}/${totalQuestions}<br>` +
                                      `${currentLang === 'ky' ? 'Пайыз' : 'Процент'}: ${percentage}%<br>` +
                                      `${currentLang === 'ky' ? 'Билим деңгээли' : 'Уровень знаний'}: ${knowledge}`;
        }
    }

    // Обновление заголовка курса
    const courseTitle = document.getElementById('course-title');
    if (courseTitle) {
        const subject = localStorage.getItem('courseSubject');
        if (subject) {
            courseTitle.textContent = subject === 'math' ? (currentLang === 'ky' ? 'Математика' : 'Математика') :
                                     subject === 'kyrgyz' ? (currentLang === 'ky' ? 'Кыргыз тили' : 'Кыргызский язык') :
                                     subject === 'manas' ? (currentLang === 'ky' ? 'Манас таануу' : 'Манасоведение') : '';
        }
    }

    // Обновление таймера
    const timerElement = document.getElementById('timer');
    if (timerElement && timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${currentLang === 'ky' ? 'Калган убакыт' : 'Оставшееся время'}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Выбор предмета
function selectSubject(subject) {
    console.log('selectSubject called with:', subject);
    if (!subject) {
        console.error('Subject is not defined');
        alert(currentLang === 'ky' ? 'Предмет тандалган жок!' : 'Предмет не выбран!');
        return;
    }
    currentSubject = subject;
    localStorage.setItem('subject', subject);
    window.location.href = 'subject.html';
}

// Выбор части
function selectPart(part) {
    console.log('selectPart called with:', part);
    if (!part) {
        console.error('Part is not defined');
        alert(currentLang === 'ky' ? 'Бөлүк тандалган жок!' : 'Часть не выбрана!');
        return;
    }
    if (!currentSubject) {
        console.error('Subject is not set');
        alert(currentLang === 'ky' ? 'Предмет тандалган жок!' : 'Предмет не выбран!');
        window.location.href = 'index.html';
        return;
    }
    currentPart = part;
    localStorage.setItem('part', part);
    window.location.href = 'part-details.html';
}

// Обновление информации о части
function updatePartDetails() {
    console.log('updatePartDetails called with:', { currentSubject, currentPart });
    const descriptionElement = document.getElementById('part-description');
    if (descriptionElement && currentPart && currentSubject) {
        const partData = questions[currentSubject][`part${currentPart}`];
        if (partData && partData.time) {
            const variants = Object.keys(partData).filter(key => key.startsWith('variant'));
            const questionCount = variants.length > 0 ? partData[variants[0]].length : 0;
            descriptionElement.textContent = currentLang === 'ky'
                ? `Суроолордун саны: ${questionCount}, Убакыт: ${partData.time} мүнөт`
                : `Количество вопросов: ${questionCount}, Время: ${partData.time} минут`;
        } else {
            console.warn('Part data or time not found:', { currentSubject, currentPart });
        }
    } else {
        console.warn('Part description element or currentPart not found:', { descriptionElement, currentPart });
    }
}

// Начало теста
function startTest() {
    console.log('startTest called with:', { currentSubject, currentPart });
    if (!currentSubject || !currentPart) {
        console.error('Subject or part not set:', { currentSubject, currentPart });
        alert(currentLang === 'ky' ? 'Предмет же бөлүк тандалган жок!' : 'Предмет или часть не выбраны!');
        window.location.href = 'index.html';
        return;
    }
    localStorage.setItem('subject', currentSubject);
    localStorage.setItem('part', currentPart);
    window.location.href = 'test.html';
}

// Загрузка теста
function loadTest() {
    console.log('loadTest called with:', { currentSubject, currentPart });
    currentSubject = localStorage.getItem('subject');
    currentPart = localStorage.getItem('part');
    console.log('Reloaded subject and part:', { currentSubject, currentPart });

    if (!currentSubject || !currentPart) {
        console.error('Subject or part not set:', { currentSubject, currentPart });
        alert(currentLang === 'ky' ? 'Предмет же бөлүк тандалган жок!' : 'Предмет или часть не выбраны!');
        window.location.href = 'index.html';
        return;
    }

    const subjectData = questions[currentSubject];
    if (!subjectData) {
        console.error('Subject data not found:', currentSubject);
        alert(currentLang === 'ky' ? 'Предмет табылган жок!' : 'Предмет не найден!');
        window.location.href = 'index.html';
        return;
    }

    const partData = subjectData[`part${currentPart}`];
    if (!partData) {
        console.error('Part data not found:', currentPart);
        alert(currentLang === 'ky' ? 'Бөлүк табылган жок!' : 'Часть не найдена!');
        window.location.href = 'index.html';
        return;
    }

    const variants = Object.keys(partData).filter(key => key.startsWith('variant'));
    if (variants.length === 0) {
        console.error('No variants found for:', currentSubject, currentPart);
        alert(currentLang === 'ky' ? 'Варианттар табылган жок!' : 'Варианты не найдены!');
        window.location.href = 'index.html';
        return;
    }

    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    currentTest = partData[randomVariant];
    if (!currentTest || currentTest.length === 0) {
        console.error('No questions found in variant:', randomVariant);
        alert(currentLang === 'ky' ? 'Суроолор табылган жок!' : 'Вопросы не найдены!');
        window.location.href = 'index.html';
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = Array(currentTest.length).fill(null);
    console.log('Test loaded:', { variant: randomVariant, questionCount: currentTest.length, time: partData.time });
    displayQuestion();
    startTimer(partData.time);
}

// Отображение вопроса
function displayQuestion() {
    console.log('displayQuestion called, index:', currentQuestionIndex);
    const questionCounter = document.getElementById('question-counter');
    const questionsDiv = document.getElementById('questions');
    const answersDiv = document.getElementById('answers');

    if (!questionCounter || !questionsDiv || !answersDiv || !currentTest) {
        console.error('Required elements or test data not found:', { questionCounter, questionsDiv, answersDiv, currentTest });
        alert(currentLang === 'ky' ? 'Тест жүктөлүүдө ката кетти!' : 'Ошибка загрузки теста!');
        window.location.href = 'index.html';
        return;
    }

    questionCounter.textContent = `${currentQuestionIndex + 1}/${currentTest.length}`;
    questionsDiv.textContent = currentTest[currentQuestionIndex].question;
    console.log('Displaying question:', currentTest[currentQuestionIndex].question);

    answersDiv.innerHTML = '';
    for (let option in currentTest[currentQuestionIndex].options) {
        const label = document.createElement('label');
        label.className = 'answer-option';
        label.innerHTML = `<input type="radio" name="answer" value="${option}" ${userAnswers[currentQuestionIndex] === option ? 'checked' : ''}> ${option.toUpperCase()}. ${currentTest[currentQuestionIndex].options[option]}`;
        answersDiv.appendChild(label);
        answersDiv.appendChild(document.createElement('br'));
    }

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', (e) => {
            userAnswers[currentQuestionIndex] = e.target.value;
            console.log('Answer selected:', e.target.value);
        });
    });
}

// Предыдущий вопрос
function prevQuestion() {
    console.log('prevQuestion called');
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Следующий вопрос
function nextQuestion() {
    console.log('nextQuestion called');
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Запуск таймера
function startTimer(minutes) {
    console.log('startTimer called with:', minutes, 'minutes');
    timeLeft = minutes * 60;
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error('Timer element not found');
        alert(currentLang === 'ky' ? 'Таймер табылган жок!' : 'Таймер не найден!');
        return;
    }

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            console.log('Timer ended, submitting test');
            clearInterval(timerInterval);
            submitTest();
            return;
        }
        const minutesLeft = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${currentLang === 'ky' ? 'Калган убакыт' : 'Оставшееся время'}: ${minutesLeft}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;
    }, 1000);
}

// Отправка теста
function submitTest() {
    console.log('submitTest called');
    if (!currentTest) {
        console.error('No test data available');
        alert(currentLang === 'ky' ? 'Тест маалыматы жок!' : 'Нет данных теста!');
        window.location.href = 'index.html';
        return;
    }

    clearInterval(timerInterval);
    let score = 0;
    currentTest.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
    });
    const percentage = (score / currentTest.length * 100).toFixed(2);
    const knowledge = percentage >= 80 ? (currentLang === 'ky' ? 'Жогорку' : 'Высокий') :
                     percentage >= 50 ? (currentLang === 'ky' ? 'Орточо' : 'Средний') :
                     (currentLang === 'ky' ? 'Төмөн' : 'Низкий');

    console.log('Test results:', { score, totalQuestions: currentTest.length, percentage, knowledge });
    localStorage.setItem('score', score);
    localStorage.setItem('totalQuestions', currentTest.length);
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('knowledge', knowledge);
    window.location.href = 'results.html';
}

// Возврат на главную
function backToMain() {
    console.log('backToMain called');
    window.location.href = 'index.html';
}

// Начало урока
function startCourseLesson() {
    console.log('startCourseLesson called');
    alert(currentLang === 'ky' ? 'Урок башталды!' : 'Урок начался!');
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    console.log('Initializing event listeners');

    // index.html
    const mathButton = document.getElementById('subject-math');
    const kyrgyzButton = document.getElementById('subject-kyrgyz');
    const manasButton = document.getElementById('subject-manas');
    const langKyButton = document.getElementById('lang-ky');
    const langRuButton = document.getElementById('lang-ru');

    if (mathButton) mathButton.addEventListener('click', () => selectSubject('math'));
    if (kyrgyzButton) kyrgyzButton.addEventListener('click', () => selectSubject('kyrgyz'));
    if (manasButton) manasButton.addEventListener('click', () => selectSubject('manas'));
    if (langKyButton) langKyButton.addEventListener('click', () => switchLanguage('ky'));
    if (langRuButton) langRuButton.addEventListener('click', () => switchLanguage('ru'));

    // subject.html
    const part1Button = document.getElementById('part-1');
    const part2Button = document.getElementById('part-2');
    const backButtonSubject = document.getElementById('back-main-subject');

    if (part1Button) part1Button.addEventListener('click', () => selectPart('1'));
    if (part2Button) part2Button.addEventListener('click', () => selectPart('2'));
    if (backButtonSubject) backButtonSubject.addEventListener('click', backToMain);

    // part-details.html
    const startTestButton = document.getElementById('start-test');
    const backButtonPart = document.getElementById('back-main-part');

    if (startTestButton) startTestButton.addEventListener('click', startTest);
    if (backButtonPart) backButtonPart.addEventListener('click', backToMain);

    // test.html
    const prevQuestionButton = document.getElementById('prev-question');
    const nextQuestionButton = document.getElementById('next-question');
    const submitTestButton = document.getElementById('submit-test');
    const backButtonTest = document.getElementById('back-main-test');

    if (prevQuestionButton) prevQuestionButton.addEventListener('click', prevQuestion);
    if (nextQuestionButton) nextQuestionButton.addEventListener('click', nextQuestion);
    if (submitTestButton) submitTestButton.addEventListener('click', submitTest);
    if (backButtonTest) backButtonTest.addEventListener('click', backToMain);

    // results.html
    const backButtonResults = document.getElementById('back-main-results');
    if (backButtonResults) backButtonResults.addEventListener('click', backToMain);

    // courses.html
    const startLessonButton = document.getElementById('start-lesson');
    const backLinkCourses = document.getElementById('back-main-courses');
    if (startLessonButton) startLessonButton.addEventListener('click', startCourseLesson);
    if (backLinkCourses) backLinkCourses.addEventListener('click', backToMain);
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initializeEventListeners();
});