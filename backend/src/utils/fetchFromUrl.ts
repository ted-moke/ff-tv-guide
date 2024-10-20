import https from "https";

const fetchFromUrl = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            } catch (error) {
              reject(new Error(`Failed to parse JSON from ${url}`));
            }
          } else if (res.statusCode === 429) {
            // Rate limit hit
            reject(new Error(`Rate limit exceeded for ${url}`));
          } else {
            reject(
              new Error(`Failed to fetch data from ${url}: ${res.statusCode}`),
            );
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default fetchFromUrl;
