import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css';
import './index.css'
import App from './App.jsx'
import emailjs from '@emailjs/browser';


const theme = createTheme({
  focusRing: 'auto',
  colors: {
    brand: [
      '#e6f4ed', '#cce9db', '#99d2b7', '#66bb93',
      '#33a46f', '#2e8b57', '#256f46', '#1c5334',
      '#123823', '#091c11'
    ],
  },
  primaryColor: 'brand',
  fontFamily: 'Open Sans, sans-serif',
  headings: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md', //md c'est le 8px qu'on utilise dans figma pour les boutons
      },
    },
  },
});

//emailjs.init('OUkE5zQHHfP7OYFEy');


import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
)
