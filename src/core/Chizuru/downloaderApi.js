const axios = require("axios");
const cheerio = require("cheerio");
const turl = require("turl");

class downloaderApi {
    async tiktok(url) {
        try {
            const response = await axios.get("https://ttdownloader.com/", {
                headers: {
                    cookie: "PHPSESSID=9ut8phujrprrmll6oc3bist01t; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
                },
            });
            
            const $ = cheerio.load(response.data);
            const token = $("#token").attr("value");
            const config = {
                url: url,
                format: "",
                token: token,
            };
            
            const response2 = await axios.post("https://ttdownloader.com/search/", new URLSearchParams(Object.entries(config)), {
                headers: {
                    cookie: "PHPSESSID=9ut8phujrprrmll6oc3bist01t; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
                },
            });
    
            const $2 = cheerio.load(response2.data);
            const nowm = await turl.shorten($2("div:nth-child(2) > div.download > a").attr("href"));
            const wm = await turl.shorten($2("div:nth-child(3) > div.download > a").attr("href"));
    
            return { nowm, wm };
        } catch (error) {
            return error.message;
        }
    }
    async instagram(url) {
        try {
          const params = new URLSearchParams();
          params.append('q', url);
          params.append('recaptchaToken', '');
          params.append('lang', 'en');
          params.append('t', 'media');
      
          const response = await axios.post('https://v3.igdownloader.app/api/ajaxSearch', params, {
            headers: {
              "authority": "v3.igdownloader.app",
              "Accept": "*/*",
              "Accept-Language": "en-US,en;q=0.9,id;q=0.8,ar;q=0.7,ms;q=0.6",
              "Content-Length": "121",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "Origin": "https://igdownloader.app",
              "Priority": "u=1, i",
              "Referer": "https://igdownloader.app/",
              "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
              "Sec-Ch-Ua-Mobile": "?0",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Site": "same-site",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0"
            },
          });
          const $ = cheerio.load(response.data.data);
          const downloadLinks = {
             link: await turl.shorten($("a.abutton").attr("href"))
          };
      
          return downloadLinks;
        } catch (error) {
          return error.message;
        }
      }
    async facebook(url) {
        try {
          const params = new URLSearchParams();
          params.append('URLz', url);
      
          const response = await axios.post('https://www.fdown.net/download.php', params, {
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9,id;q=0.8,ar;q=0.7,ms;q=0.6',
              'Cache-Control': 'max-age=0',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cookie': '_ga=GA1.1.1890950555.1715398826; cf_clearance=n7zNyJmnmv.RyRWU9UzizOZqRuUEN57.dfHqnNKEFuY-1715398826-1.0.1.1-nToIrdmXHszhP_9JBJp5wwzbkOQ4qUYd5BBHZGYznNl7JQEqaE4ZYKrhOzaQi1hEpmAZ3mxJd8Rj08e6RT1xrw; __gads=ID=bf429288d74a0d7d:T=1715398826:RT=1715399236:S=ALNI_Mbq8t5yfOhAwsLPmunsgyAw0cUKJA; __gpi=UID=00000e16d84b9d3d:T=1715398826:RT=1715399236:S=ALNI_MZEigB8ZGBUosnvvzsdscEA85Ft4A; __eoi=ID=11c9a6dc659e2680:T=1715398826:RT=1715399236:S=AA-AfjaDsV35uF8O-YH6WgWLqF69; FCNEC=%5B%5B%22AKsRol_sNiJjG6s9ojB8jVa088kWjjlhixjXOHBABXIH3UXE_e1mCFD9JDlrNYgLl4ARPUQmmY2j7JpI02FrZ1F-2YMKP-8uFn28uvLwzflW6kwtVJbW13dPPRiCo3gT6rLFLW3QC1Ajx1Brqv9-NHcRCJcCpEF1dA%3D%3D%22%5D%5D; _ga_82ERN9JZD3=GS1.1.1715398825.1.1.1715399565.58.0.0',
              'Origin': 'https://www.fdown.net',
              'Priority': 'u=0, i',
              'Referer': 'https://www.fdown.net',
              'Sec-Ch-Ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
              'Sec-Ch-Ua-Mobile': '?0',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': '?1',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
            },
          });
          const $ = cheerio.load(response.data);
      
          const downloadLinks = {
            sd: await turl.shorten($("a#sdlink").attr("href")),
            hd: await turl.shorten($("a#hdlink").attr("href"))
          };
      
          return { downloadLinks };
        } catch (error) {
          return error.message;
        }
      }
}

module.exports = downloaderApi;
