import markup from '../../sections/hero.html?raw'

export default function Hero() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
