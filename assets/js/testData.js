const testData = {
    sections: [
        {
            id: 'interests',
            title: 'A) Interests Sampler',
            description: 'How interested are you in each of these activities?',
            scale: ['Not at all', 'A little', 'Somewhat', 'Very', 'Super interested'],
            questions: [
                { id: 'C-INT-01', text: 'Reading a story or novel and talking about the characters or themes', clusters: {AV: 1, HLIT: 1} },
                { id: 'C-INT-02', text: 'Comparing different news articles about the same event', clusters: {I: 0.5, HAM: 1, AV: 0.5} },
                { id: 'C-INT-03', text: 'Visiting a museum or historical site and noticing what changed over time', clusters: {AV: 0.5, HCIV: 1, I: 0.5} },
                { id: 'C-INT-04', text: 'Learning a new language or writing in a different alphabet', clusters: {AV: 0.5, HLANG: 1, I: 0.5} },
                { id: 'C-INT-05', text: 'Sketching a scene or designing a simple poster/cover', clusters: {AV: 1, HAM: 0.5} },
                { id: 'C-INT-06', text: 'Shooting and editing a short video about something you care about', clusters: {AV: 1, HAM: 1} },
                { id: 'C-INT-07', text: 'Writing a short review (book, game, movie) that explains your opinion', clusters: {AV: 1, HLIT: 1} },
                { id: 'C-INT-08', text: 'Discussing big questions about society (fairness, rights, how decisions are made)', clusters: {I: 0.5, AV: 0.5, HCIV: 1} },
                { id: 'C-INT-09', text: 'Solving logic or math puzzles just for fun', clusters: {I: 1} },
                { id: 'C-INT-10', text: 'Building or repairing something (bike, small gadget, model)', clusters: {R: 1} },
                { id: 'C-INT-11', text: 'Doing a science experiment at home or school', clusters: {I: 1} },
                { id: 'C-INT-12', text: 'Organizing information in a list or spreadsheet so it\'s easy to find later', clusters: {C: 1} },
                { id: 'C-INT-13', text: 'Planning an event with friends (step-by-step tasks, roles, and timing)', clusters: {C: 0.5, E: 0.5} },
                { id: 'C-INT-14', text: 'Helping a younger student understand a topic', clusters: {S: 1} },
                { id: 'C-INT-15', text: 'Volunteering in the community (park clean-up, library help, tutoring)', clusters: {S: 1} },
                { id: 'C-INT-16', text: 'Starting a small creative project (zine, blog, podcast) and sharing it', clusters: {AV: 0.5, E: 0.5} },
                { id: 'C-INT-17', text: 'Making music or beats and trying different sounds', clusters: {AV: 1} },
                { id: 'C-INT-18', text: '2D/3D design (room layout, simple architecture, game level)', clusters: {AV: 0.5, R: 0.5} },
                { id: 'C-INT-19', text: 'Outdoor fieldwork (observing nature, collecting samples, mapping)', clusters: {R: 0.5, I: 0.5} },
                { id: 'C-INT-20', text: 'Looking up where information comes from before you share it', clusters: {I: 0.5, HAM: 1} },
                { id: 'C-INT-21', text: 'Mapping places and choosing the best route for a trip', clusters: {R: 0.5, I: 0.5} },
                { id: 'C-INT-22', text: 'Strategy or world-building games that need planning and trade-offs', clusters: {I: 1} },
                { id: 'C-INT-23', text: 'Working with data to find patterns (small table of numbers, scores, stats)', clusters: {I: 0.5, C: 0.5} },
                { id: 'C-INT-24', text: 'Keeping things tidy and on schedule so projects run smoothly', clusters: {C: 1, E: 0.25} }
            ]
        },
        {
            id: 'aptitude',
            title: 'B) Mini Aptitude Sampler',
            description: 'Choose the best answer for each question.',
            type: 'mcq',
            questions: [
                {
                    id: 'C-APT-01',
                    text: 'Main idea: Mia read three articles about bicycles. One compared prices, one explained safety rules, and one described the history of biking in cities. She decided to buy a used bike and always wear a helmet. What was Mia\'s main goal?',
                    options: ['Write a history report', 'Choose a safe, affordable bike', 'Compare city laws', 'Learn racing techniques'],
                    correct: 1,
                    domain: 'Verbal'
                },
                {
                    id: 'C-APT-02',
                    text: 'Word in context: "The coach gave a concise explanation before practice." "Concise" most nearly means:',
                    options: ['very long', 'balanced', 'brief and clear', 'funny'],
                    correct: 2,
                    domain: 'Verbal'
                },
                {
                    id: 'C-APT-03',
                    text: 'Best title: A short article explains how teens can check sources, compare claims, and avoid sharing rumors. Best title:',
                    options: ['Viral Videos Are Fun', 'How to Think Like a Scientist', 'Tips for Being a Smart Viewer Online', 'History of the Internet'],
                    correct: 2,
                    domain: 'Verbal'
                },
                {
                    id: 'C-APT-04',
                    text: 'Number pattern: 2, 4, 7, 11, ?',
                    options: ['13', '15', '16', '18'],
                    correct: 2,
                    domain: 'Logic'
                },
                {
                    id: 'C-APT-05',
                    text: 'Analogy: Hand is to glove as foot is to _____.',
                    options: ['sock', 'ankle', 'finger', 'sleeve'],
                    correct: 0,
                    domain: 'Logic'
                },
                {
                    id: 'C-APT-06',
                    text: 'Letter pattern: C, F, I, L, __',
                    options: ['N', 'O', 'P', 'Q'],
                    correct: 1,
                    domain: 'Logic'
                },
                {
                    id: 'C-APT-07',
                    text: 'Data sense: A class read for 20, 30, and 25 minutes on Mon, Tue, Wed. Average per day?',
                    options: ['20', '22', '25', '30'],
                    correct: 2,
                    domain: 'Data'
                },
                {
                    id: 'C-APT-08',
                    text: 'Evidence check: Strongest evidence for a health claim:',
                    options: ['One person\'s story', 'A large study that compares groups fairly', 'A popular influencer\'s video', 'A product ad'],
                    correct: 1,
                    domain: 'Data'
                },
                {
                    id: 'C-APT-09',
                    text: 'Quick reasoning: If all school buses are vehicles, and some vehicles are electric, which must be true?',
                    options: ['All school buses are electric', 'No school buses are electric', 'Some vehicles are not electric', 'School buses are vehicles'],
                    correct: 3,
                    domain: 'Logic'
                },
                {
                    id: 'C-APT-10',
                    text: 'Word choice: Choose the best sentence.',
                    options: ['Me and him went to museum.', 'Him and I went to museum.', 'He and I went to the museum.', 'I and he went museum.'],
                    correct: 2,
                    domain: 'Verbal'
                }
            ]
        },
        {
            id: 'habits',
            title: 'C) Study Habits & Learning Preferences',
            description: 'How often do you do each of these?',
            scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
            questions: [
                { id: 'C-HAB-01', text: 'Plan your week and set small goals for schoolwork' },
                { id: 'C-HAB-02', text: 'Start tasks early instead of the last minute' },
                { id: 'C-HAB-03', text: 'Break a big task into steps and check them off' },
                { id: 'C-HAB-04', text: 'Ask for help or use resources when stuck (teacher, friend, tutorial)' },
                { id: 'C-HAB-05', text: 'Take short, timed breaks to stay focused' },
                { id: 'C-HAB-06', text: 'Keep your phone or games away while studying' },
                { id: 'C-HAB-07', text: 'Review mistakes to learn what to change next time' },
                { id: 'C-HAB-08', text: 'Keep notes and files organized so you can find them quickly' }
            ]
        },
        {
            id: 'values',
            title: 'D) Values, Work Preferences & Social-Emotional Skills',
            description: 'How often do these describe you?',
            scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
            questions: [
                { id: 'C-VAL-01',
                  text: 'I enjoy working with a team toward a shared goal',
                  casel: 'relationship',
                  clusters: { S: 0.5, E: 0.25 }
                },
                { id: 'C-VAL-02', text: 'I keep trying when a task is challenging', casel: 'self_management' },
                { id: 'C-VAL-03', text: 'I take a pause when upset and then respond calmly', casel: 'self_management' },
                { id: 'C-VAL-04', text: 'I listen to others\' ideas and try to understand them', casel: 'social_awareness' },
                { id: 'C-VAL-05', text: 'I speak up respectfully when something seems unfair', casel: 'responsible_decision' },
                { id: 'C-VAL-06', text: 'I like organizing details so projects run smoothly', clusters: {C: 0.75} },
                { id: 'C-VAL-07', text: 'I enjoy leading a small project and making a plan', clusters: {E: 0.75} },
                { id: 'C-VAL-08', text: 'I check information before I share it with others', casel: 'responsible_decision' }
            ]
        },
        {
            id: 'curiosity',
            title: 'E) Curiosity & Exposure Prompts',
            description: 'Would you like to try any of these?',
            scale: ['No', 'Maybe', 'Yes (soon)'],
            questions: [
                { id: 'C-CUR-01', text: 'Debate or speech club' },
                { id: 'C-CUR-02', text: 'Start a small zine/blog/podcast about something you like' },
                { id: 'C-CUR-03', text: 'Learn basic coding to build a tiny app or game' },
                { id: 'C-CUR-04', text: 'Volunteer (library, park clean-up, tutoring)' },
                { id: 'C-CUR-05', text: 'Photography walk and a one-page photo story' },
                { id: 'C-CUR-06', text: 'Begin a new language with daily 10-minute practice' }
            ]
        },
        {
            id: 'quality',
            title: 'F) Quality Check',
            description: 'Just one quick check to ensure everything is working:',
            scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
            questions: [
                { id: 'C-QUAL-01', text: 'To help keep results accurate, please select "Sometimes"', expected: 2 }
            ]
        }
    ],
    optionalModules: {
        humanities: {
            id: 'humanities',
            title: '1) Humanities Deep-Dive',
            subsections: [
                {
                    title: 'Reading & Literature',
                    description: 'Your interest in stories, writing, and literary analysis',
                    scale: ['Not at all', 'A little', 'Somewhat', 'Very', 'Super interested'],
                    questions: [
                        { id: 'O-HUM-HLIT-01', text: 'Reading short stories and choosing a theme', clusters: {AV: 1, HLIT: 1} },
                        { id: 'O-HUM-HLIT-02', text: 'Writing a scene with strong dialogue', clusters: {AV: 1, HLIT: 1} },
                        { id: 'O-HUM-HLIT-03', text: 'Comparing two characters\' choices and how they change', clusters: {AV: 1, HLIT: 1} }
                    ],
                    mcq: {
                        id: 'O-HUM-HLIT-04',
                        text: 'Theme identification: A paragraph shows a character learning from a mistake and apologizing. Best theme?',
                        options: ['Travel is fun', 'Owning your mistakes builds trust', 'Sports are hard', 'Secrets are exciting'],
                        correct: 1,
                        domain: 'Verbal'
                    }
                },
                {
                    title: 'History & Civics',
                    description: 'Your interest in past events and how societies work',
                    scale: ['Not at all', 'A little', 'Somewhat', 'Very', 'Super interested'],
                    questions: [
                        { id: 'O-HUM-HCIV-01', text: 'Making a simple timeline for an event', clusters: {HCIV: 1, I: 0.25} },
                        { id: 'O-HUM-HCIV-02', text: 'Exploring how a local decision affects different groups', clusters: {HCIV: 1, I: 0.5} }
                    ],
                    mcq: {
                        id: 'O-HUM-HCIV-03',
                        text: 'Cause vs effect: If a new law improves bus routes, which is most likely an effect?',
                        options: ['More people use public transport', 'History of the city', 'The law was debated', 'Parks are older'],
                        correct: 0,
                        domain: 'Data'
                    }
                },
                {
                    title: 'Languages',
                    description: 'Your interest in learning and understanding languages',
                    scale: ['Not at all', 'A little', 'Somewhat', 'Very', 'Super interested'],
                    questions: [
                        { id: 'O-HUM-HLANG-01', text: 'Learning basic phrases in a new language', clusters: {HLANG: 1, AV: 0.25} },
                        { id: 'O-HUM-HLANG-02', text: 'Noticing word families and roots across languages', clusters: {HLANG: 1, I: 0.5} }
                    ],
                    mcq: {
                        id: 'O-HUM-HLANG-03',
                        text: '"telefon/telefono/телефон/տելեֆոն." What helps you guess meanings across languages?',
                        options: ['Random guessing', 'Cognates (similar roots and forms)', 'Only emojis', 'Changing the alphabet always changes meaning'],
                        correct: 1,
                        domain: 'Verbal'
                    }
                },
                {
                    title: 'Arts & Media',
                    description: 'Your interest in visual arts and media literacy',
                    scale: ['Not at all', 'A little', 'Somewhat', 'Very', 'Super interested'],
                    questions: [
                        { id: 'O-HUM-HAM-01', text: 'Making a one-minute video with a clear message', clusters: {HAM: 1, AV: 0.5} },
                        { id: 'O-HUM-HAM-02', text: 'Designing a clean poster with a clear title and sub-text', clusters: {HAM: 1, AV: 0.5} }
                    ],
                    mcq: {
                        id: 'O-HUM-HAM-03',
                        text: 'Strongest sign of a trustworthy information post:',
                        options: ['All caps and lots of emojis', 'Clear sources and evidence you can check', '"Share now!"', 'Anonymous account'],
                        correct: 1,
                        domain: 'Data'
                    }
                }
            ]
        },
        visual: {
            id: 'visual',
            title: '2) Visual-Spatial & Mapping Minis',
            description: 'Quick spatial reasoning puzzles',
            type: 'mcq',
            questions: [
                {
                    id: 'O-VIS-01',
                    text: 'You face north. Turn right. Which way now?',
                    options: ['East', 'West', 'North', 'South'],
                    correct: 0,
                    domain: 'Spatial'
                },
                {
                    id: 'O-VIS-02',
                    text: 'A map shows a library north of your home and a park east of the library. The park is ____ of your home.',
                    options: ['north', 'west', 'northeast', 'south'],
                    correct: 2,
                    domain: 'Spatial'
                },
                {
                    id: 'O-VIS-03',
                    text: 'Imagine a "T" shape rotated 90° clockwise. It now points:',
                    options: ['Up', 'Down', 'Left', 'Right'],
                    correct: 3,
                    domain: 'Spatial'
                },
                {
                    id: 'O-VIS-04',
                    text: 'Which two coordinates are on the same vertical line?',
                    options: ['(2,3) & (4,3)', '(5,1) & (5,4)', '(1,1) & (2,2)', '(3,2) & (4,2)'],
                    correct: 1,
                    domain: 'Spatial'
                }
            ]
        },
        maker: {
            id: 'maker',
            title: '3) Maker & Tech Sampler',
            description: 'Your interest in hands-on building and technology',
            scale: ['Not at all', 'A little', 'Somewhat', 'Very', 'Super interested'],
            questions: [
                { id: 'O-MAK-01', text: 'Taking something apart and putting it back together', clusters: {R: 1} },
                { id: 'O-MAK-02', text: '3D-printing or modeling a simple part', clusters: {R: 0.5, I: 0.5} },
                { id: 'O-MAK-03', text: 'Writing a tiny script to automate a task', clusters: {I: 1} },
                { id: 'O-MAK-04', text: 'Building a simple website to share your project', clusters: {AV: 0.5, I: 0.5} },
                { id: 'O-MAK-05', text: 'Designing a cozy, functional desk setup', clusters: {AV: 0.5, C: 0.5} }
            ]
        },
        creative: {
            id: 'creative',
            title: '4) Creative Sparks',
            description: 'Quick creative exercises to see how you think',
            type: 'short',
            questions: [
                { id: 'O-CRE-01', text: 'List two unusual (safe) uses for a paperclip' },
                { id: 'O-CRE-02', text: 'Pick a photo you\'ve taken. Give it a title and write 2-3 sentences that tell its story' },
                { id: 'O-CRE-03', text: 'Write one sentence that would hook a reader at the start of a story' }
            ]
        },
        community: {
            id: 'community',
            title: '5) Community & Leadership',
            description: 'How you work with others and lead projects',
            scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
            questions: [
                { id: 'O-COM-01', text: 'I include others and watch for who\'s being left out', casel: 'social_awareness' },
                { id: 'O-COM-02', text: 'I can lead a small plan (who does what, by when)', clusters: {E: 0.5, C: 0.25} },
                { id: 'O-COM-03', text: 'I give and receive feedback respectfully', casel: 'relationship_skills' },
                { id: 'O-COM-04', text: 'I show up on time and follow through', clusters: {C: 0.5} }
            ]
        },
        reflection: {
            id: 'reflection',
            title: '6) Reflection',
            description: 'Think about what you want to explore next',
            type: 'short',
            questions: [
                { id: 'O-REF-01', text: 'Three activities from today I want to try next (list them)' },
                { id: 'O-REF-02', text: 'What would make trying them easier?' },
                { id: 'O-REF-03', text: 'Who could I ask for help?' }
            ]
        }
    }
};

