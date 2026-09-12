import process from 'node:process';
import 'dotenv/config';
import { username } from './index.js';

export async function fetchData() {
    try {
        const res = await fetch(`https://api.github.com/users/${username}/events`);
        if (!res.ok) {
            throw new Error(`First response failed to fetch.`);
        }

        const remaining_ratelimit = res.headers.get('x-ratelimit-remaining');
        const Link = res.headers.get('link');
        console.log(`Link Header: ${Link}, Remaining Rate Limit: ${remaining_ratelimit}`);

        if (!Link) {
            console.log("No pagination links found. This user might have low activity.");
            return;
        }
        const ind = Link.indexOf(';');
        const link1 = Link.slice(1, ind - 1);
        console.log(`Targeting URL: ${link1}`);
        const response = await fetch(link1, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.MY_SECOND_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`Second request failed. Status: ${response.status}`);
        }
        const targetEventsArray = await response.json();

        console.log(targetEventsArray);
        
        return targetEventsArray;

    } catch (e) {
        console.error("Error fetching data:", e.message); 
    }
}

