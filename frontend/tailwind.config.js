export default{
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme:{
        extend: {
            fontFamily: {
                'sans': ['Open Sans', 'ui-sans-serif', 'system-ui'],
                'serif': ['Merriweather', 'ui-serif', 'Georgia',],
                'mono': ['SFMono-Regular', 'Menlo', 'Monaco'],
                'my-custom-font': ['"My Custom Font"', 'Arial', 'sans-serif'], 
              },
              
            colors:{
                'primary':"#5f6f8f"
            },
            gridTemplateColumns: {
                'auto':'repeat(auto-fill, minmax(20px,1fr))'
            }
        },

    },
    Plugins: [],
}