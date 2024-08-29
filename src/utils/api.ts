export async function fetchFantasyData() {
  const response = await fetch('https://api.example.com/fantasy-football');
  const data = await response.json();
  return data;
}