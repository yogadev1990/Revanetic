const axios = require('axios');

class MoeAPI {
    constructor() {
        this.baseUrl = 'https://api.jikan.moe/v4';
    }
    async searchAnime(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/anime?q=${query}&sfw`);
            const result = response.data.data;
    
            let animeDetails = `*Chizuru-chan🌸*\n\n`;
    
            result.forEach((anime, index) => {
                const title = anime.title;
                const releaseDate = new Date(anime.aired.from).toLocaleDateString();
                const episodes = anime.episodes;
                const url = anime.url;
    
                animeDetails += `*${index + 1}. ${title}*\n`;
                animeDetails += `_Tanggal Rilis:_ ${releaseDate}\n`;
                animeDetails += `_Jumlah Episode:_ ${episodes}\n`;
                animeDetails += `_Sumber:_ ${url}\n\n`;
            });
    
            return animeDetails;
        } catch (error) {
            console.error('Terjadi kesalahan:', error.message);
            return 'Terjadi kesalahan dalam pencarian.';
        }
    }
    async searchManga(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/manga?q=${query}&sfw`);
            const mangaList = response.data.data;
    
            let mangaDetails = `*Daftar Manga*\n\n`;
    
            mangaList.forEach((manga, index) => {
                const title = manga.title;
                const type = manga.type;
                const status = manga.status;
                const synopsis = manga.synopsis;
    
                mangaDetails += `*${index + 1}. ${title}*\n`;
                mangaDetails += `_Tipe:_ ${type}\n`;
                mangaDetails += `_Status:_ ${status}\n`;
                mangaDetails += `_Sinopsis:_ ${synopsis}\n\n`;
            });
    
            return mangaDetails;
        } catch (error) {
            console.error('Terjadi kesalahan:', error.message);
            return 'Terjadi kesalahan dalam pencarian manga.';
        }
    }
    async getAnime(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/${query}/anime`);
            let animeDetails = `*Chizuru-chan🌸*\n`;
      
            if (query === 'top') {
                const anim = response.data.data;
                anim.forEach((anime, index) => {
                    const title = anime.title;
                    const releaseDate = new Date(anime.aired.from).toLocaleDateString();
                    const episodes = anime.episodes;
                    const trailerUrl = anime.trailer.url;
      
                    animeDetails += `\n*${index + 1}. ${title}*\n`;
                    animeDetails += `_Tanggal Rilis:_ ${releaseDate}\n`;
                    animeDetails += `_Jumlah Episode:_ ${episodes}\n`;
                    animeDetails += `_Trailer:_ ${trailerUrl}\n`;
                });
            } else if (query === 'recommendations') {
          const recommendations = response.data.data;
                  recommendations.slice(0, 15).forEach(recommendation => {
                    const recommender = recommendation.user.username; // Nama orang yang merekomendasikan
                      recommendation.entry.forEach(anime => {
                        const title = anime.title; // Judul anime
                        const url = anime.url; // URL anime
        
                        animeDetails += `\n*Direkomendasikan oleh:* ${recommender}\n`;
                        animeDetails += `[${title}](${url})\n`;
                    });
                });
            } else if (query === 'random') {
              const animeData = response.data.data;
      
              animeDetails += `
    *Judul:* ${animeData.title}
    *Genre:* ${animeData.genres.map(genre => genre.name).join(', ')}
    *Tipe:* ${animeData.type}
    *Studio:* ${animeData.studios.map(studio => studio.name).join(', ')}
    *Jumlah Episode:* ${animeData.episodes}
    *Status:* ${animeData.status}
    *Tanggal Penayangan:* ${animeData.aired.string}
    *Durasi:* ${animeData.duration}
    *Rating:* ${animeData.rating}
    *Peringkat:* #${animeData.rank}
    *Popularitas:* #${animeData.popularity}
    *Link:* ${animeData.url}
    *Sinopsis:*
    ${animeData.synopsis}`;
            }
      
            return animeDetails;
        } catch (error) {
            console.error('Terjadi kesalahan:', error.message);
            return 'Terjadi kesalahan dalam pencarian.';
        }
    }
    async getManga(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/${query}/manga`);
            let mangaDetails = `*Daftar Manga*\n`;
      
            if (query === 'top') {
                const mangaList = response.data.data;
                    mangaList.forEach((manga, index) => {
              const title = manga.title;
              const type = manga.type;
              const status = manga.status;
              const synopsis = manga.synopsis;
              const link = manga.url;
        
              mangaDetails += `\n*${index + 1}. ${title}*\n`;
              mangaDetails += `_Tipe:_ ${type}\n`;
              mangaDetails += `_Status:_ ${status}\n`;
              mangaDetails += `_Link:_ ${link}\n`;
              mangaDetails += `_Sinopsis:_ ${synopsis}\n`;
            });
            } else if (query === 'recommendations') {
              const recommendations = response.data.data;
                    recommendations.slice(0, 15).forEach(recommendation => {
                      const recommender = recommendation.user.username;
                        recommendation.entry.forEach(anime => {
                          const title = anime.title;
                          const url = anime.url;
          
                          mangaDetails += `\n*Direkomendasikan oleh:* ${recommender}\n`;
                          mangaDetails += `[${title}](${url})\n`;
                      });
                  });
            } else if (query === 'random') {
              const animeData = response.data.data;
        
              mangaDetails += `
    *Judul:* ${animeData.title}
    *Genre:* ${animeData.genres.map(genre => genre.name).join(', ')}
    *Author:* ${animeData.authors.map(author => author.name).join(', ')}
    *Tipe:* ${animeData.type}
    *Volume:* ${animeData.volumes}
    *Jumlah Chapter:* ${animeData.chapters}
    *Status:* ${animeData.status}
    *Tanggal Publikasi:* ${animeData.published.string}
    *Peringkat:* #${animeData.rank}
    *Popularitas:* #${animeData.popularity}
    *Link:* ${animeData.url}
    *Sinopsis:*
    ${animeData.synopsis}`;
            }
      
            return mangaDetails;
        } catch (error) {
            console.error('Terjadi kesalahan:', error.message);
            return 'Terjadi kesalahan dalam pencarian.';
        }
    }  
    async ongoingAnime() {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
            const ongoingAnime = response.data.data;
    
            let animeDetails = `*Chizuru-chan🌸*\n\n`;
    
            ongoingAnime.forEach((anime, index) => {
                const title = anime.title;
                const releaseDate = new Date(anime.aired.from).toLocaleDateString();
                const episodes = anime.episodes;
                const trailerUrl = anime.trailer.url;
    
                animeDetails += `*${index + 1}. ${title}*\n`;
                animeDetails += `_Tanggal Rilis:_ ${releaseDate}\n`;
                animeDetails += `_Jumlah Episode:_ ${episodes}\n`;
                animeDetails += `_Trailer:_ ${trailerUrl}\n\n`;
            });
    
            return animeDetails;
        } catch (error) {
            console.error('Terjadi kesalahan:', error.message);
            return 'Terjadi kesalahan dalam pencarian.';
        }
    };
}

module.exports = MoeAPI;