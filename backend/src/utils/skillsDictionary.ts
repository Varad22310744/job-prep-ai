export const SKILLS_DICTIONARY = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go',
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
    'Perl', 'Haskell', 'Lua', 'Dart',

    // Frontend
    'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js', 'Svelte', 'Redux',
    'TailwindCSS', 'Bootstrap', 'Material UI', 'HTML', 'CSS', 'SASS', 'SCSS',
    'jQuery', 'Webpack', 'Vite', 'Babel', 'GraphQL',

    // Backend
    'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
    'Laravel', 'Ruby on Rails', 'ASP.NET', 'REST API', 'gRPC', 'WebSockets',

    // Databases
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra',
    'DynamoDB', 'Elasticsearch', 'Firebase', 'Supabase', 'Prisma', 'Mongoose',

    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
    'Jenkins', 'GitHub Actions', 'CircleCI', 'Linux', 'Nginx', 'Apache',

    // AI & Data
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras',
    'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'NLP', 'LLM', 'LangChain',
    'Data Analysis', 'Data Science', 'Power BI', 'Tableau',

    // Tools & Practices
    'Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Postman', 'VS Code',
    'Agile', 'Scrum', 'CI/CD', 'TDD', 'Microservices', 'System Design',

    // Soft Skills
    'Communication', 'Leadership', 'Problem Solving', 'Team Collaboration',
    'Critical Thinking', 'Time Management', 'Project Management',
];

export const extractSkillsFromJD = (jdText: string): string[] => {
    const normalizedJD = jdText.toLowerCase();

    const matched = SKILLS_DICTIONARY.filter((skill) =>
        normalizedJD.includes(skill.toLowerCase())
    );

    return [...new Set(matched)];
};
export const SKILL_ALIASES: Record<string, string[]> = {
    'React': ['reactjs', 'react.js', 'react js'],
    'Node.js': ['nodejs', 'node js', 'node'],
    'Next.js': ['nextjs', 'next js'],
    'Vue': ['vuejs', 'vue.js'],
    'PostgreSQL': ['postgres'],
    'MongoDB': ['mongo'],
    'TypeScript': ['ts'],
    'JavaScript': ['js'],
    'REST API': ['restful api', 'rest apis', 'restful'],
    'Machine Learning': ['ml'],
    'Deep Learning': ['dl'],
    'C++': ['cpp'],
    'C#': ['csharp', 'c sharp'],
};

export const normalizeSkill = (skill: string): string => {
    const lower = skill.toLowerCase();
    for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
        if (aliases.includes(lower) || canonical.toLowerCase() === lower) {
            return canonical;
        }
    }
    return skill;
};