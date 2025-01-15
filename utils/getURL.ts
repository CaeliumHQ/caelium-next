export default function getURL(url: string) {
  return process.env.NEXT_PUBLIC_API_HOST + url;
}
