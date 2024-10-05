import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './context/SocketContext.jsx'
import {store} from './Redux/Message/messageStore.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <SocketProvider>
       <App />
    </SocketProvider>
    </Provider>
  </StrictMode>,
)

