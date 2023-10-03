import { useEffect, useState } from "react";

export default function PublicPage() {
  const [html, setHtml] = useState('');

  const URL =
    process.env.NODE_ENV === "production"
      ? "https://blogposts.up.railway.app"
      : "http://localhost:3000";

  useEffect(() => {
    fetch(`${URL}/dashboard`)
    .then((res) => res.text())
    .then((data) => {
      const start = data.indexOf('<body>') + 6;
      const end = data.indexOf('</body>');
      const html = data.slice(start, end);
      setHtml(html);
    })
    .catch((err) => console.error(err));
  }, [URL]);

  return (
    <div dangerouslySetInnerHTML={{__html: html}}>
    </div>
  )
}