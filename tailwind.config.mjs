/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Accent uses CSS variable so it adapts per mode
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      maxWidth: {
        content: '72ch',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.zinc.700'),
            '--tw-prose-headings': theme('colors.zinc.900'),
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': theme('colors.zinc.900'),
            '--tw-prose-code': theme('colors.zinc.800'),
            '--tw-prose-pre-bg': theme('colors.zinc.900'),
            '--tw-prose-pre-code': theme('colors.zinc.200'),
            '--tw-prose-quotes': theme('colors.zinc.600'),
            '--tw-prose-quote-borders': 'rgb(var(--accent) / 0.4)',
            maxWidth: 'none',
            'h2, h3, h4': { fontFamily: theme('fontFamily.sans').join(', ') },
            a: { textDecorationColor: 'rgb(var(--accent) / 0.4)' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            code: {
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.875em',
              backgroundColor: theme('colors.zinc.100'),
              padding: '0.125em 0.375em',
              borderRadius: '0.25rem',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.zinc.300'),
            '--tw-prose-headings': theme('colors.zinc.100'),
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': theme('colors.zinc.100'),
            '--tw-prose-code': theme('colors.zinc.200'),
            '--tw-prose-quotes': theme('colors.zinc.400'),
            code: { backgroundColor: theme('colors.zinc.800') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
