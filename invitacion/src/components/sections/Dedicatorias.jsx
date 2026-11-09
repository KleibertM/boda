import markup from '../../sections/dedicatorias.html?raw'

export default function Dedicatorias() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
