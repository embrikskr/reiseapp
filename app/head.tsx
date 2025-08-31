export default function Head() {
  const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true'
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {isStaging && <meta name="robots" content="noindex,nofollow" />}
      <title>Travelgram (Beta)</title>
    </>
  )
}
