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
            resolve(JSON.parse(data));
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
