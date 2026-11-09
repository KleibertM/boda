import markup from '../../sections/regalos.html?raw'

export default function Regalos() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
