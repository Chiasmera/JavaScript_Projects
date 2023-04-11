//Express import
import express, { response } from 'express'
const app = express()

//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'

//Pug import
import pug from 'pug'
app.set('view engine', 'pug')

//Middleware
app.use(express.static('assets'))
