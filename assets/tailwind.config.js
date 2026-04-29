tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: { primary: '#F8F8F8', secondary: '#FFFFFF', alternative: '#2E3C41' },
        text: { primary: '#414042', secondary: '#8A8F94', alternative: '#FAFAF8' },
        border: { primary: '#E2E5E8', secondary: '#CBE1E8' },
        brand: {
          primary: '#F57F5B',
          'primary-dark': '#D96D4D',
          secondary: '#A8CDD7',
          'secondary-light': '#CBE1E8',
          'secondary-dark': '#8AB3BD',
        },
        surface: { dark: '#364449' },
        'off-white': '#F2F2F2',
      },
      fontFamily: {
        heading: ['Lora', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: { card: '12px', pill: '50px', panel: '20px' },
      boxShadow: {
        card: '0 4px 16px rgba(46, 60, 65, 0.06)',
        'card-hover': '0 12px 32px rgba(46, 60, 65, 0.08)',
      },
      maxWidth: { prose: '640px', container: '1200px' },
    },
  },
}
