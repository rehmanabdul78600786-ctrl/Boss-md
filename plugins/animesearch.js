const { cmd } = require("../command"); // Command handler
const { sleep } = require("../lib/functions"); // Sleep utility function
const fetch = require('node-fetch');
const { google } = require('googleapis');

// YouTube API Setup
const youtube = google.youtube({
    version: 'v3',
    auth: 'YOUR_YOUTUBE_API_KEY' // Replace with your YouTube API key
});

// AniList Search API
async function searchAnilist(query) {
    const queryStr = `
        query ($search: String) {
            Page (page: 1, perPage: 10) {
                media (search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                        native
                    }
                    episodes
                    coverImage {
                        extraLarge
                    }
                }
            }
        }`;

    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: queryStr,
            variables: { search: query }
        })
    });

    const data = await response.json();

    if (!data.data.Page.media) {
        return "No results found!";
    }

    return data.data.Page.media.map(item => ({
        title: item.title.romaji,
        jp_title: item.title.native,
        episodes: item.episodes,
        coverImage: item.coverImage.extraLarge,
    }));
}

// YouTube Video Search Function
async function searchYouTube(query) {
    const res = await youtube.search.list({
        part: 'snippet',
        q: query + ' anime',  // Adding 'anime' keyword to refine search
        maxResults: 1,         // Get the top video
        type: 'video'
    });

    const video = res.data.items[0];
    if (!video) {
        return 'No video found.';
    }

    const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
    return videoUrl;
}

// Command Definition
cmd({
    pattern: "anime",
    alias: ["animeSearch"],
    desc: "Search for anime details and related video",
    category: "info",  // Category of the command
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    const query = m.content.replace('!anime', '').trim(); // Get query from user input
    if (!query) {
        return reply("Please provide an anime name.");
    }

    // Fetch Anime Data from AniList
    const animeResults = await searchAnilist(query);
    if (typeof animeResults === 'string') {
        return reply(animeResults); // If no anime found
    }

    // Send anime data as an embedded message
    const embed = {
        color: 0x0099ff,
        title: `Anime Search Results for "${query}"`,
        fields: animeResults.map(result => ({
            name: result.title,
            value: `Japanese Title: ${result.jp_title}\nEpisodes: ${result.episodes}`,
            inline: true,
        })),
        image: { url: animeResults[0].coverImage },
        footer: { text: 'Anime search powered by AniList' },
    };
    await conn.sendMessage(from, { embeds: [embed] }, { quoted: mek });

    // Fetch YouTube video related to anime
    const videoUrl = await searchYouTube(query);
    await conn.sendMessage(from, `Watch this anime-related video on YouTube: ${videoUrl}`, { quoted: mek });
});

