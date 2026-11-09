import markup from '../../sections/musica.html?raw'

export default function Musica() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
