import markup from '../../sections/recuerdos.html?raw'
import qrImage from '../../assets/qr_drive.jpg'

export default function Recuerdos() {
  return <div dangerouslySetInnerHTML={{ __html: markup.replace('../assets/qr_drive.jpg', qrImage) }} />
}
