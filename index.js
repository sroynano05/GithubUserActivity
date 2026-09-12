#!/usr/bin/env node
import process from 'node:process'
import { fetchData } from './fetchOp.js';
export const username=process.argv[2];
export const id=process.argv[3]
fetchData()

