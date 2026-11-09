import markup from '../../sections/ceremonias.html?raw'

export default function Ceremonias() {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
