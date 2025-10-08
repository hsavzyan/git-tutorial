// State management
let currentSection = 0;
let responses = {};
let selectedModules = [];
let inOptionalModules = false;
let currentModuleIndex = 0;
let currentSubsectionIndex = 0;

// Phase tracking for resume functionality
let phase = localStorage.getItem('levonPhase') || 'core';
let storedModules = JSON.parse(localStorage.getItem('levonSelectedModules') || '[]');
if (storedModules.length && !selectedModules.length) selectedModules = storedModules;

// Initialize from localStorage if exists
if (localStorage.getItem('levonTestResponses')) {
    responses = JSON.parse(localStorage.getItem('levonTestResponses'));
}
if (localStorage.getItem('levonTestSection')) {
    currentSection = parseInt(localStorage.getItem('levonTestSection'));
}
if (localStorage.getItem('levonModuleIndex')) {
    currentModuleIndex = parseInt(localStorage.getItem('levonModuleIndex'));
}
if (localStorage.getItem('levonSubsectionIndex')) {
    currentSubsectionIndex = parseInt(localStorage.getItem('levonSubsectionIndex'));
}

const THEMES = {
  indigo:{accent:'#6366f1',accent600:'#4f46e5',accent100:'#eef2ff'},
  teal:{accent:'#14b8a6',accent600:'#0d9488',accent100:'#ccfbf1'},
  amber:{accent:'#f59e0b',accent600:'#d97706',accent100:'#fef3c7'}
};

function setTheme(name){
  const t = THEMES[name] || THEMES.indigo;
  Object.entries(t).forEach(([k,v])=>document.documentElement.style.setProperty(`--${k}`, v));
  localStorage.setItem('levonTheme', name);
  document.querySelectorAll('.swatch').forEach(b=>b.classList.toggle('active', b.dataset.theme===name));
}

(function initTheme(){
  const saved = localStorage.getItem('levonTheme') || 'indigo';
  setTheme(saved);
  document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click', ()=>setTheme(b.dataset.theme)));
})();

// Show resume button if there's saved progress
document.addEventListener('DOMContentLoaded', () => {
    const hasProgress = Object.keys(responses).length > 0 || currentSection > 0 || selectedModules.length > 0;
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) resumeBtn.style.display = hasProgress ? 'inline-block' : 'none';
});

// Resume test function
function resumeTest() {
    document.getElementById('welcome').classList.remove('active');
    if (phase === 'core') {
        renderSection();
    } else if (phase === 'module_select') {
        document.getElementById('moduleSelection').classList.add('active');
        updateProgress();
    } else if (phase === 'modules') {
        inOptionalModules = true;
        renderOptionalModule();
    } else {
        renderSection();
    }
}

function savePhase(newPhase) {
    phase = newPhase;
    localStorage.setItem('levonPhase', newPhase);
}

function saveModuleCursor() {
    localStorage.setItem('levonModuleIndex', String(currentModuleIndex));
    localStorage.setItem('levonSubsectionIndex', String(currentSubsectionIndex));
}

// Validation helpers
function markUnanswered(ids) {
    document.querySelectorAll('.question-group.unanswered')
        .forEach(el => el.classList.remove('unanswered'));
    ids.forEach(id => {
        const el = document.querySelector(`.question-group[data-qid="${id}"]`);
        if (el) el.classList.add('unanswered');
    });
    if (ids[0]) {
        const first = document.querySelector(`.question-group[data-qid="${ids[0]}"]`);
        if (first) first.scrollIntoView({behavior:'smooth', block:'center'});
    }
}

function isAnsweredValue(v) {
    if (typeof v === 'number') return true;
    if (typeof v === 'string') return v.trim().length > 0;
    return false;
}

function validateCurrentCoreSection() {
    const section = testData.sections[currentSection];
    if (!section || !section.questions) return true;
    const unanswered = [];
    section.questions.forEach(q => {
        if (!isAnsweredValue(responses[q.id])) unanswered.push(q.id);
    });
    if (unanswered.length) {
        markUnanswered(unanswered);
        alert('Please answer all questions on this page before continuing.');
        return false;
    }
    return true;
}

function validateCurrentOptionalPage() {
    const moduleId = selectedModules[currentModuleIndex];
    const module = testData.optionalModules[moduleId];
    if (!module) return true;
    const unanswered = [];
    if (module.subsections) {
        const ss = module.subsections[currentSubsectionIndex];
        if (ss.questions) {
            ss.questions.forEach(q => {
                if (!isAnsweredValue(responses[q.id])) unanswered.push(q.id);
            });
        }
        if (ss.mcq) {
            if (!isAnsweredValue(responses[ss.mcq.id])) unanswered.push(ss.mcq.id);
        }
    } else if (module.type === 'mcq') {
        module.questions.forEach(q => {
            if (!isAnsweredValue(responses[q.id])) unanswered.push(q.id);
        });
    } else if (module.type === 'short') {
        module.questions.forEach(q => {
            if (!isAnsweredValue(responses[q.id])) unanswered.push(q.id);
        });
    } else {
        module.questions.forEach(q => {
            if (!isAnsweredValue(responses[q.id])) unanswered.push(q.id);
        });
    }
    if (unanswered.length) {
        markUnanswered(unanswered);
        alert('Please answer all questions on this page before continuing.');
        return false;
    }
    return true;
}

function resetTest() {
    if (!confirm('This will clear ALL responses, selected modules, and progress. Ready to start fresh?')) return;
    localStorage.removeItem('levonTestResponses');
    localStorage.removeItem('levonTestSection');
    localStorage.removeItem('levonSelectedModules');
    localStorage.removeItem('levonPhase');
    localStorage.removeItem('levonModuleIndex');
    localStorage.removeItem('levonSubsectionIndex');
    responses = {};
    currentSection = 0;
    selectedModules = [];
    inOptionalModules = false;
    currentModuleIndex = 0;
    currentSubsectionIndex = 0;
    phase = 'core';
    document.querySelectorAll('.module-card.selected').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('welcome').classList.add('active');
    document.getElementById('progressBar').style.width = '0%';
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) resumeBtn.style.display = 'none';
    alert('All set. Fresh start ready.');
}

function straightLiningGentlySuggestReview() {
    const s = testData.sections[currentSection];
    if (!s || s.id !== 'interests') return true;
    const vals = s.questions.slice(0, 20).map(q => responses[q.id]).filter(v => v !== undefined);
    if (vals.length < 10) return true;
    const counts = {};
    vals.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const maxCount = Math.max(...Object.values(counts));
    const rate = maxCount / vals.length;
    if (rate >= 0.8) {
        return confirm('Quick check (no penalty): many answers in a row were the same. Do you want to skim that page once more before moving on?');
    }
    return true;
}

function toggleModule(moduleId) {
    const card = document.getElementById(`module-${moduleId}`);
    if (selectedModules.includes(moduleId)) {
        selectedModules = selectedModules.filter(m => m !== moduleId);
        card.classList.remove('selected');
    } else {
        selectedModules.push(moduleId);
        card.classList.add('selected');
    }
    localStorage.setItem('levonSelectedModules', JSON.stringify(selectedModules));
}

function skipModules() {
    showResults();
}

function startModules() {
    if (selectedModules.length === 0) {
        alert('Please select at least one module or click "Skip to Results"');
        return;
    }
    inOptionalModules = true;
    currentModuleIndex = 0;
    currentSubsectionIndex = 0;
    savePhase('modules');
    saveModuleCursor();
    document.getElementById('moduleSelection').classList.remove('active');
    renderOptionalModule();
}

function renderOptionalModule() {
    const container = document.getElementById('testSections');
    container.innerHTML = '';
    const moduleId = selectedModules[currentModuleIndex];
    const module = testData.optionalModules[moduleId];
    saveModuleCursor();
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section active';
    let html = '';
    if (module.subsections) {
        const subsection = module.subsections[currentSubsectionIndex];
        html = `
            <h2 class="section-title">${module.title}</h2>
            <h3 style="color: var(--accent-600); margin-bottom: 10px;">${subsection.title}</h3>
            <p class="section-description">${subsection.description}</p>
        `;
        if (subsection.questions) {
            subsection.questions.forEach(q => {
                html += `
                    <div class="question-group" data-qid="${q.id}">
                        <div class="question-id">${q.id}</div>
                        <div class="question-text">${q.text}</div>
                        <div class="scale-options">
                `;
                subsection.scale.forEach((label, idx) => {
                    const isSelected = responses[q.id] === idx;
                    html += `
                            <div class="scale-option ${isSelected ? 'selected' : ''}"
                                 tabindex="0" role="radio" aria-checked="${isSelected}"
                                 onclick="selectScale('${q.id}', ${idx})"
                                 onkeydown="if(event.key==='Enter'||event.key===' '){selectScale('${q.id}', ${idx})}">${label}</div>
                    `;
                });
                html += `</div></div>`;
            });
        }
        if (subsection.mcq) {
            const q = subsection.mcq;
            html += `
                <div class="question-group" data-qid="${q.id}">
                    <div class="question-id">${q.id}</div>
                    <div class="question-text">${q.text}</div>
                    <div class="mcq-options">
            `;
            q.options.forEach((opt, idx) => {
                const isSelected = responses[q.id] === idx;
                html += `
                        <div class="mcq-option ${isSelected ? 'selected' : ''}"
                             tabindex="0" role="radio" aria-checked="${isSelected}"
                             onclick="selectMCQ('${q.id}', ${idx})"
                             onkeydown="if(event.key==='Enter'||event.key===' '){selectMCQ('${q.id}', ${idx})}">
                            <span class="mcq-option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span>${opt}</span>
                        </div>
                `;
            });
            html += `</div></div>`;
        }
    } else if (module.type === 'mcq') {
        html = `
            <h2 class="section-title">${module.title}</h2>
            <p class="section-description">${module.description}</p>
        `;
        module.questions.forEach(q => {
            html += `
                <div class="question-group" data-qid="${q.id}">
                    <div class="question-id">${q.id}</div>
                    <div class="question-text">${q.text}</div>
                    <div class="mcq-options">
            `;
            q.options.forEach((opt, idx) => {
                const isSelected = responses[q.id] === idx;
                html += `
                        <div class="mcq-option ${isSelected ? 'selected' : ''}"
                             tabindex="0" role="radio" aria-checked="${isSelected}"
                             onclick="selectMCQ('${q.id}', ${idx})"
                             onkeydown="if(event.key==='Enter'||event.key===' '){selectMCQ('${q.id}', ${idx})}">
                            <span class="mcq-option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span>${opt}</span>
                        </div>
                `;
            });
            html += `</div></div>`;
        });
    } else if (module.type === 'short') {
        html = `
            <h2 class="section-title">${module.title}</h2>
            <p class="section-description">${module.description}</p>
        `;
        module.questions.forEach(q => {
            const value = responses[q.id] || '';
            html += `
                <div class="question-group" data-qid="${q.id}">
                    <div class="question-id">${q.id}</div>
                    <div class="question-text">${q.text}</div>
                    <textarea class="short-answer" id="${q.id}" onchange="saveShortAnswer('${q.id}')">${value}</textarea>
                </div>
            `;
        });
    } else {
        html = `
            <h2 class="section-title">${module.title}</h2>
            <p class="section-description">${module.description}</p>
        `;
        module.questions.forEach(q => {
            html += `
                <div class="question-group" data-qid="${q.id}">
                    <div class="question-id">${q.id}</div>
                    <div class="question-text">${q.text}</div>
                    <div class="scale-options">
            `;
            module.scale.forEach((label, idx) => {
                const isSelected = responses[q.id] === idx;
                html += `
                        <div class="scale-option ${isSelected ? 'selected' : ''}"
                             tabindex="0" role="radio" aria-checked="${isSelected}"
                             onclick="selectScale('${q.id}', ${idx})"
                             onkeydown="if(event.key==='Enter'||event.key===' '){selectScale('${q.id}', ${idx})}">${label}</div>
                `;
            });
            html += `</div></div>`;
        });
    }
    html += `
        <div class="navigation">
            <button class="nav-button secondary" onclick="previousModule()">
                ← Previous
            </button>
            <button class="nav-button" onclick="nextModule()">
                ${isLastModule() ? 'See Results →' : 'Next →'}
            </button>
        </div>
    `;
    sectionDiv.innerHTML = html;
    container.appendChild(sectionDiv);
    updateModuleProgress();
}

function isLastModule() {
    const moduleId = selectedModules[currentModuleIndex];
    const module = testData.optionalModules[moduleId];
    if (module.subsections) {
        return currentModuleIndex === selectedModules.length - 1 && currentSubsectionIndex === module.subsections.length - 1;
    } else {
        return currentModuleIndex === selectedModules.length - 1;
    }
}

function nextModule() {
    if (!validateCurrentOptionalPage()) return;
    const moduleId = selectedModules[currentModuleIndex];
    const module = testData.optionalModules[moduleId];
    if (module.subsections && currentSubsectionIndex < module.subsections.length - 1) {
        currentSubsectionIndex++;
        saveModuleCursor();
        renderOptionalModule();
    } else if (currentModuleIndex < selectedModules.length - 1) {
        currentModuleIndex++;
        currentSubsectionIndex = 0;
        saveModuleCursor();
        renderOptionalModule();
    } else {
        showResults();
    }
    window.scrollTo(0,0);
}

function previousModule() {
    const moduleId = selectedModules[currentModuleIndex];
    const module = testData.optionalModules[moduleId];
    if (module.subsections && currentSubsectionIndex > 0) {
        currentSubsectionIndex--;
        saveModuleCursor();
        renderOptionalModule();
    } else if (currentModuleIndex > 0) {
        currentModuleIndex--;
        const prevModuleId = selectedModules[currentModuleIndex];
        const prevModule = testData.optionalModules[prevModuleId];
        if (prevModule.subsections) {
            currentSubsectionIndex = prevModule.subsections.length - 1;
        } else {
            currentSubsectionIndex = 0;
        }
        saveModuleCursor();
        renderOptionalModule();
    }
    window.scrollTo(0,0);
}

function updateModuleProgress() {
    let total = 0, answered = 0;
    selectedModules.forEach(moduleId => {
        const module = testData.optionalModules[moduleId];
        if (module.questions) {
            module.questions.forEach(q => {
                total++;
                if (responses[q.id] !== undefined && responses[q.id] !== '') answered++;
            });
        }
        if (module.subsections) {
            module.subsections.forEach(subsection => {
                if (subsection.questions) {
                    subsection.questions.forEach(q => {
                        total++;
                        if (responses[q.id] !== undefined && responses[q.id] !== '') answered++;
                    });
                }
                if (subsection.mcq) {
                    total++;
                    if (responses[subsection.mcq.id] !== undefined) answered++;
                }
            });
        }
    });
    const pct = total ? (answered / total) * 100 : 0;
    document.getElementById('progressBar').style.width = pct + '%';
}

function renderSection() {
    const container = document.getElementById('testSections');
    container.innerHTML = '';
    const section = testData.sections[currentSection];
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section active';
    let html = `
        <h2 class="section-title">${section.title}</h2>
        <p class="section-description">${section.description}</p>
    `;
    if (section.type === 'mcq') {
        section.questions.forEach(q => {
            html += `
                <div class="question-group" data-qid="${q.id}">
                    <div class="question-id">${q.id}</div>
                    <div class="question-text">${q.text}</div>
                    <div class="mcq-options">
            `;
            q.options.forEach((opt, idx) => {
                const isSelected = responses[q.id] === idx;
                html += `
                        <div class="mcq-option ${isSelected ? 'selected' : ''}"
                             tabindex="0" role="radio" aria-checked="${isSelected}"
                             onclick="selectMCQ('${q.id}', ${idx})"
                             onkeydown="if(event.key==='Enter'||event.key===' '){selectMCQ('${q.id}', ${idx})}">
                            <span class="mcq-option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span>${opt}</span>
                        </div>
                `;
            });
            html += `</div></div>`;
        });
    } else {
        section.questions.forEach(q => {
            html += `
                <div class="question-group" data-qid="${q.id}">
                    <div class="question-id">${q.id}</div>
                    <div class="question-text">${q.text}</div>
                    <div class="scale-options">
            `;
            section.scale.forEach((label, idx) => {
                const isSelected = responses[q.id] === idx;
                html += `
                        <div class="scale-option ${isSelected ? 'selected' : ''}"
                             tabindex="0" role="radio" aria-checked="${isSelected}"
                             onclick="selectScale('${q.id}', ${idx})"
                             onkeydown="if(event.key==='Enter'||event.key===' '){selectScale('${q.id}', ${idx})}">${label}</div>
                `;
            });
            html += `</div></div>`;
        });
    }
    html += `
        <div class="navigation">
            <button class="nav-button secondary" onclick="previousSection()" ${currentSection === 0 ? 'disabled' : ''}>
                ← Previous
            </button>
            <button class="nav-button" onclick="nextSection()">
                ${currentSection === testData.sections.length - 1 ? 'Continue →' : 'Next →'}
            </button>
        </div>
    `;
    sectionDiv.innerHTML = html;
    container.appendChild(sectionDiv);
    updateProgress();
}

function selectScale(questionId, value) {
    responses[questionId] = value;
    saveProgress();
    if (inOptionalModules) {
        renderOptionalModule();
    } else {
        renderSection();
    }
}

function selectMCQ(questionId, value) {
    responses[questionId] = value;
    saveProgress();
    if (inOptionalModules) {
        renderOptionalModule();
    } else {
        renderSection();
    }
}

function saveShortAnswer(questionId) {
    const value = document.getElementById(questionId).value;
    responses[questionId] = value;
    saveProgress();
}

function saveProgress() {
    localStorage.setItem('levonTestResponses', JSON.stringify(responses));
    localStorage.setItem('levonTestSection', currentSection.toString());
    localStorage.setItem('levonSelectedModules', JSON.stringify(selectedModules));
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

function updateProgress() {
  let total = 0, answered = 0;
  testData.sections.forEach(sec => {
    if (!sec.questions) return;
    sec.questions.forEach(q => { total++; if (responses[q.id] !== undefined && responses[q.id] !== '') answered++; });
  });
  const pct = total ? Math.round((answered / total) * 100) : Math.round(((currentSection + 1) / testData.sections.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  const pctEl = document.getElementById('progressPct'); if (pctEl) pctEl.textContent = pct + '%';
}

function nextSection() {
    if (!validateCurrentCoreSection()) return;
    if (testData.sections[currentSection].id === 'interests') {
        if (!straightLiningGentlySuggestReview()) return;
    }
    if (testData.sections[currentSection].id === 'quality') {
        const ok = responses['C-QUAL-01'] === 2;
        if (!ok) {
            const proceed = confirm('No stress—this is just to keep results tidy. The instruction said to choose "Sometimes". Do you want to go back and switch that, or continue anyway?');
            if (!proceed) return;
        }
    }
    if (currentSection < testData.sections.length - 1) {
        currentSection++;
        saveProgress();
        renderSection();
        window.scrollTo(0,0);
    } else {
        document.getElementById('testSections').innerHTML = '';
        document.getElementById('moduleSelection').classList.add('active');
        savePhase('module_select');
        window.scrollTo(0,0);
    }
}

function previousSection() {
    if (currentSection > 0) {
        currentSection--;
        saveProgress();
        renderSection();
        window.scrollTo(0,0);
    }
}

function printResults() {
    window.print();
}

function addMoreModules() {
  document.getElementById('results').classList.remove('active');
  document.getElementById('moduleSelection').classList.add('active');
  savePhase('module_select');
  window.scrollTo(0, 0);
}

function calculateScores() {
    const scores = {
        clusters: { I: 0, AV: 0, S: 0, R: 0, E: 0, C: 0 },
        humanities: { HLIT: 0, HCIV: 0, HLANG: 0, HAM: 0 },
        aptitude: { verbal: 0, logic: 0, data: 0, spatial: 0 },
        habits: 0,
        values: {},
        curiosity: []
    };
    const clusterMax = { I: 0, AV: 0, S: 0, R: 0, E: 0, C: 0 };
    const humMax = { HLIT: 0, HCIV: 0, HLANG: 0, HAM: 0 };
    const addItems = (items) => {
        items.forEach(q => {
            const v = responses[q.id];
            if (v === undefined) return;
            if (q.clusters) {
                for (const [k, w] of Object.entries(q.clusters)) {
                    if (k in scores.clusters) {
                        scores.clusters[k] += v * w;
                        clusterMax[k] += 4 * w;
                    } else if (k in scores.humanities) {
                        scores.humanities[k] += v * w;
                        humMax[k] += 4 * w;
                    }
                }
            }
        });
    };
    testData.sections.forEach(sec => {
        if (sec.questions) addItems(sec.questions);
    });
    selectedModules.forEach(id => {
        const mod = testData.optionalModules[id];
        if (!mod) return;
        if (mod.questions) addItems(mod.questions);
        if (mod.subsections) mod.subsections.forEach(ss => ss.questions && addItems(ss.questions));
    });
    for (const k of Object.keys(scores.clusters)) {
        scores.clusters[k] = clusterMax[k] > 0 ? (scores.clusters[k] / clusterMax[k]) * 100 : 0;
    }
    for (const k of Object.keys(scores.humanities)) {
        scores.humanities[k] = humMax[k] > 0 ? (scores.humanities[k] / humMax[k]) * 100 : 0;
    }
    const apt = testData.sections.find(s => s.id === 'aptitude');
    apt.questions.forEach(q => {
        const v = responses[q.id];
        if (v === q.correct) {
            if (q.domain === 'Verbal') scores.aptitude.verbal++;
            else if (q.domain === 'Logic') scores.aptitude.logic++;
            else if (q.domain === 'Data') scores.aptitude.data++;
        }
    });
    if (selectedModules.includes('visual')) {
        testData.optionalModules.visual.questions.forEach(q => {
            const v = responses[q.id];
            if (v === q.correct) scores.aptitude.spatial++;
        });
    }
    if (selectedModules.includes('humanities')) {
        testData.optionalModules.humanities.subsections.forEach(ss => {
            if (!ss.mcq) return;
            const v = responses[ss.mcq.id];
            if (v === ss.mcq.correct) {
                if (ss.mcq.domain === 'Verbal') scores.aptitude.verbal++;
                if (ss.mcq.domain === 'Data') scores.aptitude.data++;
            }
        });
    }
    testData.sections.find(s => s.id === 'habits').questions.forEach(q => {
        const v = responses[q.id];
        if (v !== undefined) scores.habits += v;
    });
    return scores;
}

function computeQuality() {
    const attnOK = responses['C-QUAL-01'] === 2;
    const interest = testData.sections.find(s => s.id === 'interests').questions.slice(0,20);
    const vals = interest.map(q => responses[q.id]).filter(v => v !== undefined);
    let straightRate = 0;
    if (vals.length >= 10) {
        const counts = new Map();
        vals.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
        const maxCount = Math.max(...counts.values());
        straightRate = maxCount / vals.length;
    }
    const straightFlag = straightRate >= 0.8;
    return { attnOK, straightRate, straightFlag };
}

function studyBand(score) {
    if (score <= 10) return { label: 'forming routines', tip: 'Try one 15-minute focused session with a timer.' };
    if (score <= 21) return { label: 'growing consistency', tip: 'Pick one class and set a weekly start time.' };
    return { label: 'strong & reliable', tip: 'Share your method with a friend this week.' };
}

function analyzeSEL() {
    const val = id => responses[id];
    const avg = arr => {
        const got = arr.map(id => val(id)).filter(v => v !== undefined);
        return got.length ? got.reduce((a,b)=>a+b,0)/got.length : 0;
    };
    const sel = {
        self_management: avg(['C-VAL-02','C-VAL-03']),
        social_awareness: avg(['C-VAL-04','C-VAL-01']),
        responsible_decision_making: avg(['C-VAL-05','C-VAL-08']),
        leadership_organization: avg(['C-VAL-06','C-VAL-07'])
    };
    const strengths = Object.entries(sel).filter(([,v]) => v >= 3).map(([k]) => k.replace(/_/g,' '));
    let focus = null;
    if (Object.keys(sel).length) {
        const [kMin] = Object.entries(sel).sort((a,b)=>a[1]-b[1])[0];
        focus = kMin.replace(/_/g,' ');
    }
    return { sel, strengths, focus };
}

const clusterSuggestions = {
    I: ['mini research thread on a topic you pick','strategy or logic puzzle challenge with a friend'],
    AV: ['write a short review (book/game/film) and post it in a zine/blog','make a one-minute video with a clear message'],
    S: ['peer-tutoring a younger student','volunteer one hour (library or park)'],
    R: ['fix/upgrade something at home or bike tune-up','build a tiny model or desk organizer'],
    E: ['plan a small event or club intro session','pitch a project idea to friends and assign roles'],
    C: ['organize class notes/files for one subject','make a simple tracking sheet for a project']
};

function pickThemes(topClusters, topHumanities) {
    const themes = [];
    const top = topClusters.map(c => c[0]);
    const hTop = topHumanities[0]?.[0];
    if (top.includes('AV') && (hTop === 'HLIT' || hTop === 'HAM')) {
        themes.push('creative writing + zine/blog', 'film/music + media literacy');
    }
    if (top.includes('I') && (hTop === 'HCIV' || hTop === 'HAM')) {
        themes.push('civics + media fact-checking', 'data-curious mini projects');
    }
    if (top.includes('R')) {
        themes.push('maker + mapping/field notes');
    }
    if (top.includes('E') && top.includes('C')) {
        themes.push('organize a small event with timelines');
    }
    if (!themes.length) themes.push('one humanities micro-project + a practical task');
    return [...new Set(themes)].slice(0,3);
}

function downloadJSON() {
    const payload = { timestamp: new Date().toISOString(), responses, scores: calculateScores(), selectedModules };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'levon_orientation_results.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function downloadCSV() {
    const s = calculateScores();
    const flat = [];
    Object.entries(responses).forEach(([id, val]) => flat.push({type:'response', id, value: val}));
    Object.entries(s.clusters).forEach(([id, pct]) => flat.push({type:'cluster_pct', id, value: Math.round(pct)}));
    Object.entries(s.humanities).forEach(([id, pct]) => flat.push({type:'humanities_pct', id, value: Math.round(pct)}));
    Object.entries(s.aptitude).forEach(([id, v]) => flat.push({type:'aptitude', id, value: v}));
    flat.push({type:'habits_total', id:'C-HAB', value: s.habits});
    const header = ['type','id','value'];
    const rows = [header.join(',')].concat(flat.map(r => [r.type, r.id, r.value].join(',')));
    const blob = new Blob([rows.join('\n')], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'levon_orientation_results.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}

function importJSON(arg) {
  let file = null;
  // Allow both patterns: importJSON(event) and importJSON(file)
  if (arg && arg.target && arg.target.files && arg.target.files[0]) {
    file = arg.target.files[0];
  } else if (arg instanceof File) {
    file = arg;
  }
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.responses) {
        responses = data.responses;
        localStorage.setItem('levonTestResponses', JSON.stringify(responses));
      }
      if (Array.isArray(data.selectedModules)) {
        selectedModules = data.selectedModules;
        localStorage.setItem('levonSelectedModules', JSON.stringify(selectedModules));
      }
      if (typeof data.phase === 'string') {
        savePhase(data.phase);
      }
      alert('Import complete. You can resume or jump to Results.');
      // Refresh current view sensibly
      if (phase === 'module_select') {
        document.getElementById('moduleSelection').classList.add('active');
        updateProgress();
      } else if (phase === 'modules') {
        inOptionalModules = true;
        renderOptionalModule();
      } else {
        renderSection();
      }
    } catch (e) {
      alert('Sorry—could not read that file. Is it a valid JSON export from this tool?');
    }
  };
  reader.readAsText(file);
}

function downloadItemBank() {
  const bank = {
    title: "Career & Interest Explorer - Item Bank",
    version: "1.0",
    scales: {
      interest5: ["Not at all","A little","Somewhat","Very","Super interested"],
      freq5: ["Never","Rarely","Sometimes","Often","Always"],
      curiosity3: ["No","Maybe","Yes (soon)"]
    },
    score_map: {
      // index = score; keep indexes aligned with labels
      interest5: [0,1,2,3,4],
      freq5: [0,1,2,3,4],
      curiosity3: [0,1,2]
    },
    scoring_rules: {
      clusters: "Sum mapped item values; for multi-mapped items split points by weights; rescale to 0–100 via (score / max_possible) * 100.",
      humanities: "Sum items tagged HLIT/HCIV/HLANG/HAM; rescale to 0–100.",
      aptitude: {
        Verbal: ["C-APT-01","C-APT-02","C-APT-03","C-APT-10"],
        Logic:  ["C-APT-04","C-APT-05","C-APT-06","C-APT-09"],
        Data:   ["C-APT-07","C-APT-08"],
        Spatial:["O-VIS-01","O-VIS-02","O-VIS-03","O-VIS-04"]
      },
      habits_band: { forming:[0,10], growing:[11,21], strong:[22,32] },
      quality: {
        attention: "C-QUAL-01 should equal index 2 (label: 'Sometimes')",
        straight_line: "Soft-flag if ≥80% identical choices across first 20 interest items"
      }
    },
    clusters: { I:"Analytical-Investigative", AV:"Artistic-Verbal", S:"Social-Helping", R:"Practical-Maker", E:"Enterprising-Initiator", C:"Organized-Detail" },
    humanities: ["HLIT","HCIV","HLANG","HAM"],
    sections: testData.sections,
    optionalModules: testData.optionalModules
  };

  const blob = new Blob([JSON.stringify(bank, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "levon_item_bank.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function generateParentBrief() {
  const scores = calculateScores();
  const band = studyBand(scores.habits);
  const sortedClusters = Object.entries(scores.clusters).sort((a,b)=>b[1]-a[1]);
  const top2 = sortedClusters.slice(0,2);
  const sortedHumanities = Object.entries(scores.humanities).sort((a,b)=>b[1]-a[1]);
  const topH = sortedHumanities.slice(0,2);

  const clusterNames = { I:'Analytical-Investigative', AV:'Artistic-Verbal', S:'Social-Helping', R:'Practical-Maker', E:'Enterprising-Initiator', C:'Organized-Detail' };
  const humanitiesNames = { HLIT:'Reading & Literature', HCIV:'History & Civics', HLANG:'Languages', HAM:'Arts & Media' };
  const themes = pickThemes(top2, topH);

  const briefWindow = window.open('', 'ParentBrief', 'width=800,height=1000');
  const d = briefWindow.document;

  const scoreItem = (label, val) => `
    <div class="score-item">
      <div class="label">${label}</div>
      <div class="bar"><div class="fill" style="width:${Math.round(val)}%"></div></div>
      <div class="num">${Math.round(val)}%</div>
    </div>`;

  d.write(`<!DOCTYPE html>
  <html><head><meta charset="utf-8"><title>Parent Summary</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:720px;margin:24px auto;line-height:1.5;color:#1f2937}
    h1{font-size:22px;color:#4f46e5;margin:0 0 10px}
    h2{font-size:18px;margin:18px 0 8px;color:#374151}
    p{margin:8px 0}
    .section{padding:12px 0;border-top:1px solid #e5e7eb}
    .scores{display:grid;grid-template-columns:1fr;gap:10px}
    .score-item{display:grid;grid-template-columns:160px 1fr 48px;align-items:center;gap:10px}
    .bar{height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden}
    .fill{height:100%;background:#6366f1}
    .pill{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef2ff;color:#3730a3;margin-right:6px;margin-bottom:6px}
    .btn-print{margin-top:18px;padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;background:#fff}
    ul{margin:8px 0 8px 18px}
  </style></head>
  <body>
    <h1>Parent Summary</h1>

    <div class="section">
      <h2>Top Interest Patterns</h2>
      <div class="scores">
        ${sortedClusters.map(([k,v]) => scoreItem(clusterNames[k], v)).join('')}
      </div>
    </div>

    <div class="section">
      <h2>Humanities Snapshot</h2>
      <div class="scores">
        ${sortedHumanities.map(([k,v]) => scoreItem(humanitiesNames[k], v)).join('')}
      </div>
    </div>

    <div class="section">
      <h2>Suggested Exploration Themes</h2>
      <p>Low-cost, low-stakes directions to try next:</p>
      <ul>${themes.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>

    <div class="section">
      <h2>Quick Snapshot</h2>
      <p><strong>Study habits:</strong> ${band.label}. Tip: ${band.tip}</p>
    </div>

    <div class="section">
      <h2>This Week’s Actions</h2>
      <ul>
        <li>Let your child pick one theme above and plan a one-hour “first step”.</li>
        <li>Encourage a short reflection afterwards: what worked, what to change.</li>
      </ul>
    </div>

    <div class="section">
      <h2>Home Support Tips</h2>
      <ul>
        <li>Keep it exploratory; avoid turning interests into “tracks”.</li>
        <li>Offer small scaffolds (materials, time, a buddy) instead of pressure.</li>
      </ul>
    </div>

    <div style="text-align:right">
      <button class="btn-print" onclick="window.print()">Print This Brief</button>
    </div>
  </body></html>`);
  d.close();
}

function showResults() {
    document.getElementById('testSections').innerHTML = '';
    document.getElementById('moduleSelection').classList.remove('active');
    const scores = calculateScores();
    const quality = computeQuality();
    const selInfo = analyzeSEL();
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.add('active');
    const resultsContent = document.getElementById('resultsContent');
    const sortedClusters = Object.entries(scores.clusters).sort((a,b)=>b[1]-a[1]);
    const sortedHumanities = Object.entries(scores.humanities).sort((a,b)=>b[1]-a[1]);
    const topClusters = sortedClusters.slice(0,3);
    const topHumanities = sortedHumanities.slice(0,3);
    const clusterNames = { I:'Analytical-Investigative', AV:'Artistic-Verbal', S:'Social-Helping', R:'Practical-Maker', E:'Enterprising-Initiator', C:'Organized-Detail' };
    const humanitiesNames = { HLIT:'Reading & Literature', HCIV:'History & Civics', HLANG:'Languages', HAM:'Arts & Media' };
    const clusterDescriptions = {
        I:'Enjoys analyzing, asking "why?", solving puzzles, and exploring ideas and systems.',
        AV:'Enjoys language, storytelling, design, music, and creative expression across media.',
        S:'Enjoys teaching, mentoring, listening, and helping communities thrive.',
        R:'Enjoys building, fixing, tinkering, testing, and fieldwork outdoors.',
        E:'Enjoys initiating projects, organizing people, and presenting/pitching ideas.',
        C:'Enjoys structure, planning, tidy systems, and tracking details to make things run.'
    };
    const band = studyBand(scores.habits);
    const top2 = sortedClusters.slice(0,2);
    const topH = sortedHumanities.slice(0,2);
    const themes = pickThemes(top2, topH);
    const curiosityLabels = ['Debate or speech club','Start a zine/blog/podcast','Learn basic coding','Volunteer locally','Photography walk & story','Begin a new language'];
    const tryNext = [];
    testData.sections.find(s => s.id === 'curiosity').questions.forEach((q, idx) => { if (responses[q.id] === 2) tryNext.push(curiosityLabels[idx]); });
    let recommended = '';
    if (tryNext.length) {
        const topKey = top2[0]?.[0];
        const map = { I:['Learn basic coding','Debate or speech club'], AV:['Start a zine/blog/podcast','Photography walk & story'], S:['Volunteer locally','Debate or speech club'], R:['Photography walk & story','Learn basic coding'], E:['Debate or speech club','Start a zine/blog/podcast'], C:['Start a zine/blog/podcast','Begin a new language'] };
        const prefs = map[topKey] || tryNext;
        recommended = prefs.find(x => tryNext.includes(x)) || tryNext[0];
    }
    const clusterBarsHTML = () => {
        let h = '<div class="cluster-chart">';
        Object.entries(scores.clusters).sort((a,b)=>b[1]-a[1]).forEach(([k,pct]) => {
            h += `
                <div class="cluster-item">
                    <div class="cluster-label"><span>${clusterNames[k]}</span><span class="cluster-score">${Math.round(pct)}%</span></div>
                    <div class="score-bar"><div class="score-fill" style="width:${pct}%"></div></div>
                </div>`;
        });
        h += '</div>';
        return h;
    };
    const humanitiesBarsHTML = () => {
        let h = '<div class="cluster-chart">';
        Object.entries(scores.humanities).sort((a,b)=>b[1]-a[1]).forEach(([k,pct]) => {
            h += `
                <div class="cluster-item">
                    <div class="cluster-label"><span>${humanitiesNames[k]}</span><span class="cluster-score">${Math.round(pct)}%</span></div>
                    <div class="score-bar"><div class="score-fill" style="width:${pct}%"></div></div>
                </div>`;
        });
        h += '</div>';
        return h;
    };
    let html = `
        <div class="result-card" style="border-left-color:${quality.attnOK && !quality.straightFlag ? '#4caf50' : '#ff9800'}">
          <h3>✅ Quality check (no penalty)</h3>
          <p>${quality.attnOK ? 'Attention check looks good.' : 'If you were moving quickly, you can switch the attention item to "Sometimes."'}</p>
          <p>${quality.straightFlag ? 'Many answers in a row were the same. If that was accidental, feel free to skim the interests page again.' : 'Answer patterns look varied.'}</p>
        </div>
    `;
    if (selectedModules.length === 0) {
        html += `
        <div class="result-card" style="border-left-color:#3b82f6">
          <h3>🧭 CORE session</h3>
          <p>You ran the CORE today. Optional modules can be added anytime—your results will update when you take them.</p>
        </div>
        `;
    }
    const clusterPills = topClusters.map(([k])=>`<span class="pill">${k}</span>`).join('');
    const humanPills = topHumanities.map(([k])=>`<span class="pill">${k}</span>`).join('');
    html += `
        <div class="result-card">
          <h3>Top clusters</h3>
          <div class="pills">${clusterPills}</div>
          <h3 style="margin-top:12px">Top humanities</h3>
          <div class="pills">${humanPills}</div>
        </div>
        <div class="result-card"><h3>🎯 Your Interest Patterns</h3>${clusterBarsHTML()}<p style="margin-top:12px">Think of these as the kinds of activities you naturally lean toward—not boxes, just clues for what could be fun or meaningful right now.</p></div>
        <div class="result-card"><h3>💡 What This Means</h3>
    `;
    top2.forEach(([k,pct]) => {
        if (pct > 20) {
            const ideas = (clusterSuggestions[k] || []).slice(0,3).map(s => `• ${s}`).join('<br>');
            html += `<p><strong>${clusterNames[k]}:</strong> ${clusterDescriptions[k]}<br>${ideas}</p>`;
        }
    });
    html += `</div><div class="result-card"><h3>📚 Humanities Deep Notes</h3>${humanitiesBarsHTML()}<p style="margin-top:10px">High scores here mean these areas might feel energizing. Mid scores = decent interest; try small experiments. Lower scores aren't "bad"—they just might need a cooler entry point.</p><ul style="margin-top:8px"><li><strong>${humanitiesNames.HLIT}:</strong> Try a short story + 1-paragraph review or annotate a favorite scene.</li><li><strong>${humanitiesNames.HCIV}:</strong> Pick a local issue, map who's affected, and share a one-page explainer.</li><li><strong>${humanitiesNames.HLANG}:</strong> 10-minute daily streak with cognates; track phrases you can actually use.</li><li><strong>${humanitiesNames.HAM}:</strong> Make a 60-sec video with a clear message; list sources in the caption.</li></ul></div>`;
    html += `<div class="result-card"><h3>🧠 Quick Skills Check</h3><p><strong>Verbal/Reading:</strong> ${scores.aptitude.verbal}/4 — ${scores.aptitude.verbal >= 3 ? 'Strong comprehension and wording.' : scores.aptitude.verbal >= 2 ? 'Solid base—keep reading and summarizing.' : 'Keep at it—short, daily reading helps a ton.'}</p><p><strong>Pattern/Logic:</strong> ${scores.aptitude.logic}/4 — ${scores.aptitude.logic >= 3 ? 'Elite pattern spotting.' : scores.aptitude.logic >= 2 ? 'Pretty good on puzzle flow.' : 'Practice makes smooth—try daily puzzles.'}</p><p><strong>Data/Media Sense:</strong> ${scores.aptitude.data}/2 — ${scores.aptitude.data === 2 ? 'Solid fact-checking energy.' : scores.aptitude.data === 1 ? 'On the right track—look for sources.' : 'Start with quick source checks before sharing.'}</p>${selectedModules.includes('visual') ? `<p><strong>Visual-Spatial:</strong> ${scores.aptitude.spatial}/4 — ${scores.aptitude.spatial >= 3 ? 'Great spatial awareness.' : scores.aptitude.spatial >= 2 ? 'Good sense of direction.' : 'Try small map/rotation puzzles.'}</p>` : ''}<p style="margin-top:8px">These are light snapshots—not grades. They show what clicked today, not limits.</p></div>`;
    const habitsScore = scores.habits;
    let habitsMessage = '';
    if (habitsScore <= 10) {
        habitsMessage = 'You\'re still forming study routines. Try picking one small habit this week, like setting a timer for 15-minute study sessions.';
    } else if (habitsScore <= 21) {
        habitsMessage = 'You\'re building consistency. Keep strengthening these habits. Maybe try a study buddy or a new note-taking method.';
    } else {
        habitsMessage = 'You have strong, reliable study habits. Keep up the great work and maybe share your tips with friends.';
    }
    html += `<div class="result-card"><h3>📖 Study Habits</h3><p>${habitsMessage}</p></div>`;
    if (tryNext.length) {
        html += `<div class="result-card"><h3>🚀 Ready to Try</h3><p>You said you're interested in trying:</p><ul>${tryNext.map(x=>`<li>${x}</li>`).join('')}</ul>${recommended ? `<p style="margin-top:10px;color:var(--accent);"><strong>Quick win:</strong> ${recommended} — pick a date, a buddy, and what "done" looks like.</p>` : ''}</div>`;
    }
    if (responses['O-REF-01'] || responses['O-REF-02'] || responses['O-REF-03']) {
        html += '<div class="result-card"><h3>💭 Your Reflections</h3>';
        if (responses['O-REF-01']) html += `<p><strong>Activities to try:</strong> ${responses['O-REF-01']}</p>`;
        if (responses['O-REF-02']) html += `<p><strong>What would help:</strong> ${responses['O-REF-02']}</p>`;
        if (responses['O-REF-03']) html += `<p><strong>Who can help:</strong> ${responses['O-REF-03']}</p>`;
        html += '</div>';
    }
    if (selectedModules.length > 0) {
        const moduleNames = { humanities:'Humanities Deep-Dive', visual:'Visual-Spatial & Mapping', maker:'Maker & Tech Sampler', creative:'Creative Sparks', community:'Community & Leadership', reflection:'Reflection' };
        html += '<div class="result-card"><h3>✅ Modules Completed</h3><p>Great job completing these optional modules:</p><ul>';
        selectedModules.forEach(moduleId => { html += `<li>${moduleNames[moduleId]}</li>`; });
        html += '</ul></div>';
    }
    resultsContent.innerHTML = html;
    setTimeout(() => {
        document.querySelectorAll('.score-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => { bar.style.width = width; }, 100);
        });
    },100);
    window.scrollTo(0,0);
}

function startTest() {
    document.getElementById('welcome').classList.remove('active');
    currentSection = 0;
    savePhase('core');
    renderSection();
}

// expose functions
window.startTest = startTest;
window.resumeTest = resumeTest;
window.resetTest = resetTest;
window.toggleModule = toggleModule;
window.skipModules = skipModules;
window.startModules = startModules;
window.previousModule = previousModule;
window.nextModule = nextModule;
window.selectScale = selectScale;
window.selectMCQ = selectMCQ;
window.saveShortAnswer = saveShortAnswer;
window.previousSection = previousSection;
window.nextSection = nextSection;
window.printResults = printResults;
window.addMoreModules = addMoreModules;
window.downloadJSON = downloadJSON;
window.downloadCSV = downloadCSV;
window.importJSON = importJSON;
window.downloadItemBank = downloadItemBank;
window.generateParentBrief = generateParentBrief;
window.showResults = showResults;
