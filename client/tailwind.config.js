/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                elegant: {
                    blue: '#C8D9E6',
                    cream: '#F5EFEB',
                    burgundy: '#D8B4BA',
                }
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            }
        },
    },
    plugins: [],
}
