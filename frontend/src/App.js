import React from 'react'
import Products from './Products/Products'
import Header from './Header/Header'
import Home from './Home/Home'
import {Routes,Route} from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/cart' element={<h1>Cart</h1>}/>
        <Route path='*' element={<h1>404 Not Found</h1>}/>
      </Routes>
    </div>
  )
}

export default App