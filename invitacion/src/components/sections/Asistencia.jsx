import markup from '../../sections/asistencia.html?raw'

export default function Asistencia() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
