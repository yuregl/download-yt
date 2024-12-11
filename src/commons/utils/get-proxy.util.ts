const proxies = [
    "http://64.92.82.58:80",
    "http://20.206.106.192:8123",
    "http://18.228.198.164:80",
    "http://20.24.43.214:8123",
    "http://189.240.60.168:9090",
];

export function getRandomProxy(): string {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
}
