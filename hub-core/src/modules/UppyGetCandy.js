const { Plugin } = require('@uppy/core')

class UppyGetcandy extends Plugin {
  constructor (uppy, opts) {
    super(uppy, opts)
    this.context = opts.context
    this.validation = opts.validation || null
    this.id = opts.id || 'GetCandy'
    this.type = 'getcandy-asset-uploader'
    this.upload = this.upload.bind(this)
    this.validateFiles = this.validateFiles.bind(this)
  }

  upload (fileIds) {
    const promises = fileIds.map((fileId) => {
      const file = this.uppy.getFile(fileId)
      this.uppy.emit('before-upload', file)
      const formData = new FormData()
      formData.append('file', file.data)
      if (this.opts.parent_id && this.opts.assetable) {
        formData.append('parent_id', this.opts.parent_id)
        formData.append('parent', this.opts.assetable)
      }
      return this.context.assets.upload(formData, {
        includes: 'transforms'
      }).then((response) => {
        const body = response.data
        const uploadURL = body.thumbnail
        console.log(this.uppy.getFile(fileId))
        this.uppy.emit('upload-success', file, {
          status: response.status,
          body,
          uploadURL
        })
      }).catch((error) => {
        const { data } = error.response
        this.uppy.emit('upload-error', file, {
          message: data.file[0]
        }, {
          file: file.id,
          errors: data.file
        })
      })
    })
    return Promise.all(promises)
  }

  install () {
    this.uppy.addPreProcessor(this.validateFiles)
    this.uppy.addUploader(this.upload)
  }

  async getImageDimensions (file) {
    return new Promise(async (resolve, reject) => {
      const data = await this.getDataFromFile(file)

      const img = new Image()

      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img
        resolve({ width, height })
      }
       // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
      img.onerror = () => {
          reject('There was some problem with the image.')
      }

      img.src = data
    })
  }

  getDataFromFile (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file.data)
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }

  async validateFiles (fileIDs) {
    return new Promise(async (resolve, reject) => {
      const { width, height } = this.validation

      if (!width || !height) {
        return resolve()
      }
      fileIDs.forEach(async element => {
        const file = this.uppy.getFile(element)

        try {
          const dimensions = await this.getImageDimensions(file)
          if (dimensions.height != height || dimensions.width != width) {
            reject({
              file: file.id,
              message: `Image dimensions must be ${width}px by ${height}px`
            })
          }
        } catch (err) {
        }
        resolve()
      })
    });
  }
}

export default UppyGetcandy
