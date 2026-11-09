import markup from '../../sections/recuerdos.html?raw'

export default function Recuerdos() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
