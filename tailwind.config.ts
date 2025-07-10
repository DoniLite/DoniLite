import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      typography: () => ({
        // Thème par défaut (mode clair)
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-foreground)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-foreground)',
            '--tw-prose-counters': 'var(--color-muted-foreground)',
            '--tw-prose-bullets': 'var(--color-muted-foreground)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-foreground)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-muted-foreground)',
            '--tw-prose-code': 'var(--color-accent-foreground)',
            '--tw-prose-pre-code': 'var(--color-muted-foreground)',
            '--tw-prose-pre-bg': 'var(--color-muted)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)',

            // Styles spécifiques pour les éléments
            color: 'var(--tw-prose-body)',
            'max-width': 'none',

            // Liens
            a: {
              color: 'var(--tw-prose-links)',
              'text-decoration': 'underline',
              'text-decoration-color': 'var(--color-primary)',
              'text-underline-offset': '2px',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'var(--color-primary)',
                'text-decoration-color': 'var(--color-primary)'
              }
            },

            // Titres
            'h1, h2, h3, h4, h5, h6': {
              color: 'var(--tw-prose-headings)',
              'font-weight': '600'
            },

            // Code inline
            code: {
              color: 'var(--tw-prose-code)',
              'background-color': 'var(--color-accent)',
              padding: '0.25rem 0.375rem',
              'border-radius': 'var(--radius-sm)',
              'font-size': '0.875em',
              'font-weight': '500'
            },

            // Blocs de code
            pre: {
              'background-color': 'var(--tw-prose-pre-bg)',
              border: '1px solid var(--color-border)',
              'border-radius': 'var(--radius-lg)',
              padding: '0.5rem',
              'overflow-x': 'auto'
            },

            'pre code': {
              'background-color': 'transparent',
              color: 'var(--tw-prose-pre-code)',
              padding: '0',
              'border-radius': '0',
              'font-weight': '400'
            },

            // Citations
            // blockquote: {
            //   'border-left': '4px solid var(--tw-prose-quote-borders)',
            //   color: 'var(--tw-prose-quotes)',
            //   'font-style': 'italic',
            //   margin: '1.5rem 0',
            //   'padding-left': '1rem',
            //   'background-color': 'var(--color-muted)',
            //   'border-radius': 'var(--radius-md)',
            //   padding: '0.2rem'
            // },

            // Listes
            'ul, ol': {
              margin: '1rem 0'
            },

            li: {
              margin: '0.5rem 0'
            },

            // Tableaux
            table: {
              'border-collapse': 'collapse',
              width: '100%'
            },

            th: {
              'border-bottom': '2px solid var(--tw-prose-th-borders)',
              padding: '0.75rem',
              'text-align': 'left',
              'font-weight': '600'
            },

            td: {
              'border-bottom': '1px solid var(--tw-prose-td-borders)',
              padding: '0.75rem'
            },

            // Images
            img: {
              'border-radius': 'var(--radius-lg)',
              margin: '1.5rem 0'
            },

            // Séparateurs
            hr: {
              'border-color': 'var(--tw-prose-hr)',
              margin: '2rem 0'
            }
          }
        },

        // Thème pour mode sombre (utilise les variables invert)
        invert: {
          css: {
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-foreground)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-foreground)',
            '--tw-prose-counters': 'var(--color-muted-foreground)',
            '--tw-prose-bullets': 'var(--color-muted-foreground)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-foreground)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-muted-foreground)',
            '--tw-prose-code': 'var(--color-accent-foreground)',
            '--tw-prose-pre-code': 'var(--color-muted-foreground)',
            '--tw-prose-pre-bg': 'var(--color-muted)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)'
          }
        },

        // Thème spécifique "orange" basé sur votre couleur primaire
        orange: {
          css: {
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-primary)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-primary)',
            '--tw-prose-counters': 'var(--color-secondary)',
            '--tw-prose-bullets': 'var(--color-secondary)',
            '--tw-prose-hr': 'var(--color-primary)',
            '--tw-prose-quotes': 'var(--color-primary)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-muted-foreground)',
            '--tw-prose-code': 'var(--color-primary)',
            '--tw-prose-pre-code': 'var(--color-foreground)',
            '--tw-prose-pre-bg': 'var(--color-accent)',
            '--tw-prose-th-borders': 'var(--color-primary)',
            '--tw-prose-td-borders': 'var(--color-border)',

            // Version invert pour le mode sombre
            '--tw-prose-invert-body': 'var(--color-foreground)',
            '--tw-prose-invert-headings': 'var(--color-primary)',
            '--tw-prose-invert-lead': 'var(--color-muted-foreground)',
            '--tw-prose-invert-links': 'var(--color-primary)',
            '--tw-prose-invert-bold': 'var(--color-primary)',
            '--tw-prose-invert-counters': 'var(--color-secondary)',
            '--tw-prose-invert-bullets': 'var(--color-secondary)',
            '--tw-prose-invert-hr': 'var(--color-primary)',
            '--tw-prose-invert-quotes': 'var(--color-primary)',
            '--tw-prose-invert-quote-borders': 'var(--color-primary)',
            '--tw-prose-invert-captions': 'var(--color-muted-foreground)',
            '--tw-prose-invert-code': 'var(--color-primary)',
            '--tw-prose-invert-pre-code': 'var(--color-foreground)',
            '--tw-prose-invert-pre-bg': 'var(--color-accent)',
            '--tw-prose-invert-th-borders': 'var(--color-primary)',
            '--tw-prose-invert-td-borders': 'var(--color-border)'
          }
        },

        // Thème "minimal" pour un look plus épuré
        minimal: {
          css: {
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-foreground)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-foreground)',
            '--tw-prose-bold': 'var(--color-foreground)',
            '--tw-prose-counters': 'var(--color-muted-foreground)',
            '--tw-prose-bullets': 'var(--color-muted-foreground)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-muted-foreground)',
            '--tw-prose-quote-borders': 'var(--color-border)',
            '--tw-prose-captions': 'var(--color-muted-foreground)',
            '--tw-prose-code': 'var(--color-foreground)',
            '--tw-prose-pre-code': 'var(--color-muted-foreground)',
            '--tw-prose-pre-bg': 'var(--color-muted)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)',

            // Styles spécifiques au thème minimal
            a: {
              'text-decoration': 'none',
              'border-bottom': '1px solid var(--color-border)',
              '&:hover': {
                'border-bottom-color': 'var(--color-primary)'
              }
            },

            blockquote: {
              'border-left': '2px solid var(--color-border)',
              'background-color': 'transparent'
            }
          }
        }
      })
    }
  }
}

export default config
