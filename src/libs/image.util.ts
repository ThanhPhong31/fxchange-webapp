import { storage } from './firebase'
import { generateUUID } from './utils'
import { UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import { getBlob, getDownloadURL, ref } from 'firebase/storage'
import moment from 'moment'

const toDataURL = (url: string) =>
  fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': 'http://fexchange-b23e0.appspot.com',
      'If-None-Match': '16e4504d1c28e5844b4fd7f6fe305f52',
    },
  })
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
    )

function dataURLtoFile(dataUrl: any, filename: string) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = Buffer.from(arr[1], 'base64'),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr[n]
  }
  return new File([u8arr], filename, { type: mime })
}

function getFirebaseFile(url: string) {
  const httpsReference = ref(storage, url)
  return getBlob(httpsReference).then(
    (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
  )
}

// export function listDataUrlToFileList(list?: string[]) {
//   if (!list) return []
//   const fileArr: UploadFile[] = []
//   list.forEach((url) => {
//     getFirebaseFile(url).then((dataUrl) => {
//       console.log('Here is Base64 Url', dataUrl)
//       var fileData = dataURLtoFile(dataUrl, 'imageName.jpg')
//       const uid = generateUUID(10)
//       const uploadFile: UploadFile = {
//         uid: uid,
//         name: fileData.name,
//         fileName: fileData.name,
//         originFileObj: {
//           ...fileData,
//           lastModifiedDate: moment(fileData.lastModified).toDate(),
//           uid: uid,
//         } as RcFile,
//         status: 'done',
//         size: fileData.size,
//         lastModified: fileData.lastModified,

//         type: fileData.type,
//       }
//       fileArr.push(uploadFile)
//     })
//   })

//   return fileArr
// }

export function listDataUrlToFileList(list?: string[]) {
  if (!list) return []
  return list.map((url, index) => {
    return {
      uid: '-' + index,
      name: 'image.jpeg',
      status: 'done',
      url: url,
    }
  })
}
