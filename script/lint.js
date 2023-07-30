const lint = require('@umijs/lint/dist/index').default;

lint(
  { cwd: process.cwd() },
  {
    _: ['packages/**/{src,test}/**/*.{js,jsx,ts,tsx}'],
    fix: true,
    eslintOnly: true,
  },
);
